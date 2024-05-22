import { Injectable } from '@nestjs/common';
import { CreateIndexingDto } from './dto/create-indexing.dto';
import { UpdateIndexingDto } from './dto/update-indexing.dto';
import { ESService } from '../ESService';
import { book_test2_mapping } from './mapping/bookTestMapping';
import * as fs from 'fs';
import * as path from 'path';
import { book_test2_setting } from './setting/bookTestSetting';
import { separateChosung } from '../utils/chosung.utils';

@Injectable()
export class IndexingService {
  constructor(private readonly esClient: ESService) {}
  async startIndexing(indexName: string) {
    // index 생성
    await this.esClient.createIndex(indexName);

    // index close
    await this.esClient.closeIndex({ indexName });

    // setting
    const settingInfo = book_test2_setting;
    await this.esClient.putSetting({
      indexName,
      settings: settingInfo,
    });

    // index open
    await this.esClient.openIndex({ indexName });

    // mapping
    const bookProjectMappingInfo = book_test2_mapping;
    await this.esClient.putMapping({
      indexName,
      properties: bookProjectMappingInfo.properties,
    });

    // indexing document
    const FILE_NAME = 'BOOK_TEST.csv';

    const csvPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      FILE_NAME,
    );
    // console.log(csvPath);
    const csvFile = fs.readFileSync(csvPath, 'utf-8');
    const rows = csvFile.split('\n');
    // console.log(rows);

    const result = [];
    const columnTitle = rows[0];
    const dataRows = rows.slice(1);
    for (const row of dataRows) {
      // console.log(row);
      const splitRow = row.split('","');
      // console.log(temp);

      const cleanRow = [];
      for (let i of splitRow) {
        i = i.replace(/\"/gi, '');

        cleanRow.push(i);
      }
      result.push(cleanRow);
    }

    let bulkData = [];

    for (let elem = 0; elem < result.length; elem++) {
      const indexRow = {
        index: {
          _index: indexName,
          _id: result[elem][1],
        },
      };
      const titleChosung = separateChosung(result[elem][3]);
      const dataRow = {
        titleName: result[elem][3],
        titleChosung,
        authorName: result[elem][4],
        publisherName: result[elem][5],
        price: result[elem][8],
        imageUrl: result[elem][9],
        bookIntroduction: result[elem][10],
      };
      bulkData.push(indexRow, dataRow);

      if (elem % 1000 === 0) {
        await this.esClient.bulk({ data: bulkData });
        bulkData = [];
      }
    }
  }

  async deleteIndex(indexName: string) {
    await this.esClient.deleteIndex(indexName);
  }

  async putAlias({ aliasName, indexName }) {
    await this.esClient.putAlias({ aliasName, indexName });
  }

  async deleteAlias({ aliasName, indexName }) {
    await this.esClient.deleteAlias({ aliasName, indexName });
  }
}
