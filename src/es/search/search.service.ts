import { Injectable } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { ESService } from '../ESService';
import { QueryDslMatchAllQuery } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class SearchService {
  constructor(private readonly esService: ESService) {}
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

  async searchTitle({ queryVar, pageNo }) {
    const sizeNo = 10;
    const from = (pageNo - 1) * sizeNo;
    const index = 'booktest1';
    const query = {
      from: from,
      size: sizeNo,
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
          ],
          score_mode: 'multiply',
          boost_mode: 'multiply',
        },
      },
    };

    const result = await this.esService.search({ query, index });

    // console.log('--------', result);
    return result;
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
    return result;
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
