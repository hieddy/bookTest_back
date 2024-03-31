import { Module } from '@nestjs/common';
import { ESConnectionModule } from '../ESConnection.module';
import { LoggingService } from './logging.service';

@Module({
  imports: [ESConnectionModule],
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}
