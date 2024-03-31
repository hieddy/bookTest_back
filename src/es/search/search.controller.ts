import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  // @Post()
  // create(@Body() createSearchDto: CreateSearchDto) {
  //   return this.searchService.create(createSearchDto);
  // }
  @Get()
  async findAll(@Body() getAllFeedInput) {
    // console.log('controller');
    return this.searchService.test(getAllFeedInput);
  }

  // @Get('title')
  // async searchTitle(
  //   @Query('query') queryVar: string,
  //   @Query('pageNo') pageNo: number = 1,
  // ) {
  //   console.log('---------');
  //   console.log('hi');
  //   return this.searchService.searchTitle({ queryVar, pageNo });
  // }

  @Get('title')
  async searchTitle(
    @Query('page') pageNo: number,
    @Query('pageSize') pageSize: number,
    @Query('searchText') searchText: string,
  ) {
    console.log('---------');
    console.log('hi');

    const { total, results } = await this.searchService.searchTitle(
      pageNo,
      pageSize,
      searchText,
    );
    const data = { total, results };
    return data;
  }

  @Get('autoComplete')
  async autoComplete(@Query('searchText') searchText: string) {
    console.log('Hi');
    const { results } = await this.searchService.autoComplete(searchText);
    const data = { results };
    return data;
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.searchService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSearchDto: UpdateSearchDto) {
  //   return this.searchService.update(+id, updateSearchDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.searchService.remove(+id);
  // }
}
