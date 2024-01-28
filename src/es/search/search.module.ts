import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ESConnectionModule } from '../ESConnection.module';

@Module({
  imports: [ESConnectionModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
