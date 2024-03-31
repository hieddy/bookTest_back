import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ESConnectionModule } from '../ESConnection.module';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [ESConnectionModule, LoggingModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
