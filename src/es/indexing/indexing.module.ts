import { Module } from '@nestjs/common';
import { IndexingService } from './indexing.service';
import { IndexingController } from './indexing.controller';
import { ESConnectionModule } from '../ESConnection.module';

@Module({
  imports: [ESConnectionModule],
  controllers: [IndexingController],
  providers: [IndexingService],
})
export class IndexingModule {}
