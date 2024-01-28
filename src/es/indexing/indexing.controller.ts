import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { IndexingService } from './indexing.service';
import { CreateIndexingDto } from './dto/create-indexing.dto';
import { UpdateIndexingDto } from './dto/update-indexing.dto';

@Controller('indexing')
export class IndexingController {
  constructor(private readonly indexingService: IndexingService) {}
  @Put(':indexName')
  async startIndexing(@Param('indexName') indexName: string) {
    await this.indexingService.startIndexing(indexName);
    return { message: 'Ready To Go' };
  }

  @Delete(':indexName')
  async deleteIndex(@Param('indexName') indexName: string) {
    await this.indexingService.deleteIndex(indexName);
    return { message: 'Deleted Successfully' };
  }

  // @Post()
  // create(@Body() createIndexingDto: CreateIndexingDto) {
  //   return this.indexingService.create(createIndexingDto);
  // }

  // @Get()
  // findAll() {
  //   return this.indexingService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.indexingService.findOne(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.indexingService.remove(+id);
  // }
}
