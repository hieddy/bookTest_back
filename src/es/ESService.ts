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

  async createLogCount({ index, id, document }) {
    await this.esClient.index({ index, id, document });
  }

  async updateLogCount({ id, index, script }) {
    await this.esClient.update({ id, index, script });
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

  async getAggs({ index, query }) {
    const response = await this.esClient.search({ index, body: query });
    return response;
  }

  async msearch(query) {
    const response = await this.esClient.msearch({
      searches: query,
    });
  }

  async putAlias({ indexName, aliasName }) {
    const result = await this.esClient.indices.putAlias({
      index: indexName,
      name: aliasName,
    });
  }

  async deleteAlias({ indexName, aliasName }) {
    const result = await this.esClient.indices.deleteAlias({
      index: indexName,
      name: aliasName,
    });
  }
}
