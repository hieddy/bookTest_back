import { Controller, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { IndexingService } from './indexing.service';

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

  @Post('/alias')
  async putAlias(@Body() body: { aliasName: string; indexName: string }) {
    await this.indexingService.putAlias(body);
    return { message: 'alias changed successfully' };
  }
}
