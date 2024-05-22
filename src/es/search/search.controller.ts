import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('title')
  async searchTitle(
    @Query('page') pageNo: number,
    @Query('pageSize') pageSize: number,
    @Query('searchText') searchText: string,
  ) {
    const { total, results, arrangedResults } =
      await this.searchService.searchTitle(pageNo, pageSize, searchText);
    const data = { total, results, arrangedResults };
    return data;
  }

  @Get('author')
  async searchAuthor(
    @Query('page') pageNo: number,
    @Query('pageSize') pageSize: number,
    @Query('searchText') searchText: string,
  ) {
    // console.log('------ author -------');
    const { total, results, arrangedResults } =
      await this.searchService.searchAuthor(pageNo, pageSize, searchText);
    const data = { total, results, arrangedResults };
    return data;
  }

  @Get('autoComplete')
  async autoComplete(@Query('searchText') searchText: string) {
    console.log('Hi');
    const { results } = await this.searchService.autoComplete(searchText);
    const data = { results };
    return data;
  }

  @Get('popularKeywords')
  async getPopularKeywords() {
    const data = await this.searchService.getPopularKeywords();
    return data;
  }
}
