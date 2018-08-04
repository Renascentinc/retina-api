const { Client } = require('pg');
const logger = require('./logger');
const appConfig = require('./app-config');
const fileUtils = require('./utils/file-utils');
const rawQueries = require('./sql/raw-queries');

class Db {

  connect() {
    if (appConfig['db.reinitialize']) {

    }

    this.dbConnection = new Client({
      user: appConfig['db.user'],
      host: appConfig['db.host'],
      database: appConfig['db.database'],
      password: appConfig['db.password'],
      port: appConfig['db.port'],
    });

    await this.dbConnection.connect();

    await this.dropDbFunctions();
    await this.loadDbFunctions();
    this.decorate();

  }

  async disconnect() {
    await this.dbConnection.end();
  }

  async dropDbFunctions() {
    let dropFunctionsQueries = await this.rawQuery({
      text: rawQueries.getDropFunctionsQueries,
      rowMode: 'array'
    });

    dropStatements = dropFunctionsQueries.rows.map(row => row[0]).join('');
    await this.rawQuery(dropStatements);
  }

  async loadDbFunctions() {
    let functions = fileUtils.readFilesFromDir(appConfig['db.functionDir']);
    await this.rawQuery(functions.join(';'));
  }

  rawQuery(query) {
    return await this.dbConnection.query(query);
  }

  decorate() {

  }

}

module.exports = Db;
