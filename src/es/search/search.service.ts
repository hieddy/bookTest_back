import { Injectable } from '@nestjs/common';
import { ESService } from '../ESService';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly esService: ESService,
    private readonly loggingService: LoggingService,
  ) {}

  async findAll() {
    const index = 'test';
    const query = {
      query: {
        match_all: {},
      },
    };

    const result = await this.esService.search({ index, query });

    return result;
  }

  async searchTitle(pageNo, pageSize, searchText) {
    const sizeNo = pageSize ? pageSize : 10;
    const from = pageNo ? (pageNo - 1) * sizeNo : 0;
    const keyword = searchText || '';
    const index = 'booktest';
    const query = {
      from: from,
      size: sizeNo,
      query: {
        function_score: {
          query: {
            multi_match: {
              query: keyword,
              fields: [
                'titleName.standard',
                'titleName.letter_ENGram',
                'titleName.keyword_ENGram',
                'titleName.keyword_lower_blank_edgeNGram',
                'titleChosung.keyword_lower_blank_edgeNGram',
                'titleChosung.keyword',
              ],
            },
          },
          functions: [
            {
              filter: {
                match: { 'titleName.standard': keyword },
              },
              weight: 3,
            },
            {
              filter: {
                match: { 'titleName.letter_ENGram': keyword },
              },
              weight: 1,
            },
            {
              filter: {
                match: { 'titleName.keyword_ENGram': keyword },
              },
              weight: 2,
            },
            {
              filter: {
                match: { 'titleName.keyword_lower_blank_edgeNGram': keyword },
              },
              weight: 4,
            },
            {
              filter: {
                match: { 'titleChosung.keyword': keyword },
              },
              weight: 4,
            },
            {
              filter: {
                match: { 'titleChosung.letter_ENGram': keyword },
              },
              weight: 4,
            },
          ],
          score_mode: 'multiply',
          boost_mode: 'multiply',
        },
      },
    };

    const esData = await this.esService.search({ query, index });

    const { total: resultCount, sourceList: resultArr, took } = esData;

    const arrangedResults = [];

    const queryLog = {
      index,
      query: keyword,
      total: resultCount,
      took: took,
    };
    if (keyword != '') {
      await this.loggingService.logSearchKeywordTest(queryLog);
    }
    return { total: resultCount, results: resultArr, arrangedResults };
  }

  async searchAuthor(pageNo, pageSize, searchText) {
    const sizeNo = pageSize ? pageSize : 10;
    const from = pageNo ? (pageNo - 1) * sizeNo : 0;
    const keyword = searchText || '';
    const index = 'booktest';
    const query = {
      from,
      size: sizeNo,
      query: {
        match: {
          authorName: keyword,
        },
      },
    };

    const esData = await this.esService.search({ query, index });

    const { total: resultCount, sourceList: resultArr, took } = esData;

    let arrangedResults = [];
    if (resultCount === 0) {
      // const arrangedQuery = {
      //   from,
      //   size: sizeNo,
      //   query: {
      //     fuzzy: {
      //       'authorName.keyword': {
      //         value: keyword,
      //         fuzziness: 1,
      //         max_expansions: 50,
      //         prefix_length: 1,
      //         transpositions: false,
      //       },
      //     },
      //   },
      // };

      const arrangedQuery = {
        from,
        size: sizeNo,
        query: {
          match: {
            authorName: {
              query: keyword,
              fuzziness: 1,
            },
          },
        },
      };

      const arrangedEsData = await this.esService.search({
        query: arrangedQuery,
        index,
      });
      const {
        total: arrangedResultCount,
        sourceList: arrangedResultArr,
        took: arrangedTook,
      } = arrangedEsData;

      arrangedResults = arrangedResultArr;
    }

    const queryLog = {
      index,
      query: keyword,
      total: resultCount,
      took: took,
    };
    if (keyword != '') {
      await this.loggingService.logSearchKeywordTest(queryLog);
    }
    return { total: resultCount, results: resultArr, arrangedResults };
  }

  async autoComplete(queryVar: string) {
    const index = 'booktest';
    const query = {
      size: 5,
      query: {
        function_score: {
          query: {
            multi_match: {
              query: queryVar,
              fields: [
                'titleName.standard',
                'titleName.letter_ENGram',
                'titleName.keyword_ENGram',
                'titleName.keyword_lower_blank_edgeNGram',
                'titleChosung.keyword_lower_blank_edgeNGram',
                'titleChosung.keyword',
              ],
            },
          },
          functions: [
            {
              filter: {
                match: { 'titleName.standard': queryVar },
              },
              weight: 3,
            },
            {
              filter: {
                match: { 'titleName.letter_ENGram': queryVar },
              },
              weight: 1,
            },
            {
              filter: {
                match: { 'titleName.keyword_ENGram': queryVar },
              },
              weight: 2,
            },
            {
              filter: {
                match: { 'titleName.keyword_lower_blank_edgeNGram': queryVar },
              },
              weight: 4,
            },
            {
              filter: {
                match: {
                  'titleChosung.keyword_lower_blank_edgeNGram': queryVar,
                },
              },
              weight: 4,
            },
            {
              filter: {
                match: { 'titleChosung.keyword': queryVar },
              },
              weight: 4,
            },
            {
              filter: {
                match: { 'titleChosung.letter_ENGram': queryVar },
              },
              weight: 4,
            },
          ],
          score_mode: 'multiply',
          boost_mode: 'multiply',
        },
      },
      _source: ['titleName', 'titleChosung'],
    };

    const result = await this.esService.search({ query, index });

    return { results: result.sourceList };
  }

  async getPopularKeywords() {
    const indexName = 'logging_search_keyword-*';
    const query = {
      size: 0,
      aggs: {
        pop: {
          terms: {
            field: 'query.keyword',
          },
          // aggs: {
          //   count: {
          //     sum: {
          //       field: 'count',
          //     },
          //   },
          // },
        },
      },
    };

    const esData = await this.esService.getAggs({ query, index: indexName });

    const result = esData.aggregations.pop['buckets'];

    // console.log('---------', esData.aggregations.pop['buckets']);
    return result;
  }
}
