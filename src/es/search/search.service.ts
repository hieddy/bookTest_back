import { Injectable } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { ESService } from '../ESService';
import { QueryDslMatchAllQuery } from '@elastic/elasticsearch/lib/api/types';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly esService: ESService,
    private readonly loggingService: LoggingService,
  ) {}
  // create(createSearchDto: CreateSearchDto) {
  //   return 'This action adds a new search';
  // }

  async findAll() {
    const index = 'test';
    const query = {
      query: {
        match_all: {},
      },
    };

    const result = await this.esService.search({ index, query });
    // return `This action returns all search`;
    return result;
  }

  async test(getAllFeedInput) {
    const { pageInfo } = getAllFeedInput;
    const collectionSizeInfo = 1;
    const collectionPageInfo = collectionSizeInfo * (pageInfo - 1);
    const shortformSizeInfo = 2;
    const shortformPageInfo = shortformSizeInfo * (pageInfo - 1);
    const snapSizeInfo = 2;
    const snapPageInfo = snapSizeInfo * (pageInfo - 1);

    const body = [
      { index: 'shortform' },
      {
        from: shortformPageInfo,
        size: shortformSizeInfo,
        query: { match_all: {} },
      },
      { index: 'snap' },
      {
        from: snapPageInfo,
        size: snapSizeInfo,
        query: { match_all: {} },
      },
      { index: 'collection' },
      {
        from: collectionPageInfo,
        size: collectionSizeInfo,
        query: { match_all: {} },
      },
    ];
    const result = await this.esService.msearch(body);
  }

  async searchTitle(pageNo, pageSize, searchText) {
    // console.log('==========', param);
    const sizeNo = 10;
    const from = pageNo ? (pageNo - 1) * sizeNo : 0;
    const keyword = searchText || '';
    const index = 'booktest1';
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
          ],
          score_mode: 'multiply',
          boost_mode: 'multiply',
        },
      },
    };

    // if (queryVar.length === 0) {
    //   query.query = {
    //     match_all: {},
    //   };
    // }

    // console.log('----', JSON.stringify(query));
    const esData = await this.esService.search({ query, index });

    // console.log('--------', result);
    const queryLog = {
      index,
      query: keyword,
      total: esData.total,
      took: esData.took,
    };
    await this.loggingService.logSearchKeyword(queryLog);
    return { total: esData.total, results: esData.sourceList };
  }

  async autoComplete(queryVar: string) {
    const index = 'booktest1';
    const query = {
      size: 5,
      query: {
        function_score: {
          query: {
            multi_match: {
              query: `${queryVar}`,
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

    // console.log('---------', result);
    return { results: result.sourceList };
    // return { total: esData.total, results: esData.sourceList };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} search`;
  // }

  // update(id: number, updateSearchDto: UpdateSearchDto) {
  //   return `This action updates a #${id} search`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} search`;
  // }
}
