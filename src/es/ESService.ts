import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ESService {
  constructor(private readonly esClient: ElasticsearchService) {}

  fieldFinder(dataSet, fields = [], defaultValue = undefined) {
    return (
      (Array.isArray(fields) &&
        fields.length > 0 &&
        fields.reduce(
          (acc, val) =>
            acc && Object.prototype.hasOwnProperty.call(acc, val)
              ? acc[val]
              : defaultValue,
          dataSet,
        )) ||
      defaultValue
    );
  }

  async putMapping({ indexName, properties }) {
    await this.esClient.indices.putMapping({
      index: indexName,
      properties,
    });
  }

  async putSetting({ indexName, settings }) {
    await this.esClient.indices.putSettings({
      index: indexName,
      settings,
    });
  }

  async closeIndex({ indexName }) {
    await this.esClient.indices.close({
      index: indexName,
    });
  }

  async openIndex({ indexName }) {
    await this.esClient.indices.open({
      index: indexName,
    });
  }

  async createIndex(indexName) {
    await this.esClient.indices.create({ index: indexName });
  }

  async createIndexWithMappingSetting({ indexName, settingInfo, mappingInfo }) {
    await this.esClient.indices.create({
      index: indexName,
      mappings: mappingInfo,
      settings: settingInfo,
    });
  }

  async checkIndexExists(indexName) {
    const result = await this.esClient.indices.exists({ index: indexName });
    return result;
  }

  async putDocument({ index, id, document }) {
    await this.esClient.index({ index, id, document });
  }

  async updateDocument({ id, index, doc }) {
    await this.esClient.update({ id, index, doc });
  }

  async bulk({ data }) {
    await this.esClient.bulk({ body: data });
  }

  async deleteIndex(indexName) {
    await this.esClient.indices.delete({ index: indexName });
  }

  async search({ index, query }) {
    const response = await this.esClient.search({
      index,
      body: query,
    });

    const responseBody = response;

    const total = Number(
      this.fieldFinder(responseBody, ['hits', 'total', 'value'], 0),
    );
    const hits = this.fieldFinder(responseBody, ['hits', 'hits'], []);
    const sourceList = hits.map((source) => source._source);
    const took = Number(this.fieldFinder(responseBody, ['took'], 0));

    return { total, sourceList, took };
  }

  async msearch(query) {
    const response = await this.esClient.msearch({
      searches: query,
    });

    // console.log(response.responses);
    console.log(response.responses[0]['hits']['hits'][0]);
    console.log(response.responses[0]['hits']['hits'][1]);
    console.log(response.responses[1]['hits']['hits'][0]);
    console.log(response.responses[1]['hits']['hits'][1]);
    console.log(response.responses[2]['hits']['hits'][0]);
    // const totalTook = response.body.took;
    // const responseBody = response.body.responses;
    // const dataArray = responseBody.map((each) => ({
    //   took: each.took,
    //   total: each.hits.total.value,
    //   sourceList: each.hits.hits,
    // }));

    // console.log('------------', data);
    // return dataArray;
  }
}
