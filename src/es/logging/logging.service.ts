import { Injectable } from '@nestjs/common';
import { ESService } from '../ESService';
import { currentDateConverter } from '../utils/dateConverter.utils';
import * as uuid from 'uuid4';

@Injectable()
export class LoggingService {
  constructor(private readonly esClient: ESService) {}

  async logSearchKeyword(queryLog) {
    const { query: searchQuery, total: hitCount, took } = queryLog;
    const documentId = uuid();

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

      const logDocument = {
        id: documentId,
        query: searchQuery,
        count: 1,
        // hitCount,
        // took,
      };

      await this.esClient.createLogCount({
        id: documentId,
        index: indexName,
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
              value: searchQuery,
            },
          },
        },
      };
      const loggedQueryInfo = await this.esClient.search({
        index: indexName,
        query: loggedInfoFinder,
      });

      if (loggedQueryInfo.total === 0) {
        const logDocument = {
          id: documentId,
          query: searchQuery,
          count: 1,
          // hitCount,
          // took,
        };
        await this.esClient.createLogCount({
          id: documentId,
          index: indexName,
          document: logDocument,
        });
      } else {
        const script = {
          source: 'ctx._source.count += 1',
          lang: 'painless',
        };
        await this.esClient.updateLogCount({
          index: indexName,
          id: loggedQueryInfo.sourceList[0].id,
          script,
        });
      }
    }
  }

  async logSearchKeywordTest(queryLog) {
    const { query: searchQuery, total: hitCount, took, index } = queryLog;
    const documentId = uuid();

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
    }
    //3. index 있으면
    //3-1. document create
    const logDocument = {
      id: documentId,
      indexName: index,
      query: searchQuery,
      count: 1,
      hitCount,
      took,
    };

    await this.esClient.createLogCount({
      id: documentId,
      index: indexName,
      document: logDocument,
    });
  }
}
