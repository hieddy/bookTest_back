import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SearchModule } from './es/search/search.module';
import { IndexingModule } from './es/indexing/indexing.module';

@Module({
  imports: [ConfigModule.forRoot(), SearchModule, IndexingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
