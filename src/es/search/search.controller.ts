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
  async findAll() {
    // console.log('controller');
    return this.searchService.findAll();
  }

  @Get('title')
  async searchTitle(
    @Query('query') queryVar: string,
    @Query('pageNo') pageNo: number = 1,
  ) {
    console.log('---------');
    console.log('hi');
    return this.searchService.searchTitle({ queryVar, pageNo });
  }

  @Get('autoComplete')
  async autoComplete(@Query('query') queryVar: string) {
    console.log('Hi');
    return this.searchService.autoComplete(queryVar);
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
