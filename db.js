const { Client } = require('pg');
const logger = require('./logger');
const appConfig = require('./app-config');
const fileUtils = require('./utils/file-utils');
const rawQueries = require('./sql/raw-queries');

class Db {

  constructor(dbClient) {
    this.db = dbClient;
    // Do logic to decorate functions
  }

  async disconnect() {
    await this.db.end();
  }

}

module.exports = Db;
