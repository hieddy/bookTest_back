import { Injectable } from '@nestjs/common';
import { ESService } from '../ESService';
import { currentDateConverter } from '../utils/dateConverter.utils';
import * as uuid from 'uuid4';

@Injectable()
export class LoggingService {
  constructor(private readonly esClient: ESService) {}

  async logSearchKeyword(queryLog) {
    const currentTime = new Date();
    const currentDate = currentDateConverter(currentTime);

    const indexName = `logging_search_keyword-${currentDate}`;
    // 1. index 존재여부 확인
    const indexInfo = await this.esClient.checkIndexExists(indexName);

    // 2. index 없으면
    // 2-1. index 생성, index close, index setting, index open, index mappipng
    //2-2. indexing document
    if (!indexInfo) {
      await this.esClient.createIndex(indexName);
      const searchQuery = queryLog.query;

      const logDocument = {
        count: 1,
        query: searchQuery,
      };

      await this.esClient.putDocument({
        index: indexName,
        id: searchQuery,
        document: logDocument,
      });
    }

    //3. index 있으면
    //3-1. document update
    if (indexInfo) {
      const loggedInfoFinder = {
        query: {
          term: {
            'query.keyword': {
              value: queryLog.query,
            },
          },
        },
      };
      const loggedQueryInfo = await this.esClient.search({
        index: indexName,
        query: loggedInfoFinder,
      });
      // console.log(queryLog.query);
      // console.log(loggedQueryInfo);

      if (loggedQueryInfo.total === 0) {
        const searchQuery = queryLog.query;
        const logDocument = {
          count: 1,
          query: searchQuery,
        };
        await this.esClient.putDocument({
          index: indexName,
          id: searchQuery,
          document: logDocument,
        });
      } else {
        const count = loggedQueryInfo.sourceList[0].count + 1;
        const searchQuery = queryLog.query;
        const logDocument = {
          count,
          query: searchQuery,
        };
        await this.esClient.updateDocument({
          index: indexName,
          id: searchQuery,
          doc: logDocument,
        });
      }
    }
  }
}
