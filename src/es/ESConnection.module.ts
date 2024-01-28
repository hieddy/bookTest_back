import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ESService } from './ESService';
import { IndexingModule } from './indexing/indexing.module';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: process.env.ES_NODE,
        maxRetries: 10,
        requestTimeout: 6000,
        auth: {
          username: process.env.ES_USERNAME,
          password: process.env.ES_PASSWORD,
        },
      }),
    }),
  ],
  providers: [ESService],
  exports: [ESService],
})
export class ESConnectionModule {}
