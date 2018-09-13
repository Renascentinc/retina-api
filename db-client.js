const { Client } = require('pg');
var named = require('yesql').pg
const appConfig = require('./app-config');
const { ArgumentError, DbClientError, DbError } = require('./error.js')
const { getDbFunctionNames } = require('./sql/raw-queries');
const logger = require('./logger');
const util = require('util');

class DbClient {

  constructor() {
    this.loggableDbConfig = util.inspect({
      host: appConfig['db.host'],
      database: appConfig['db.database'],
      port: appConfig['db.port']
    }, false);

    this.client = new Client({
      user: appConfig['db.user'],
      host: appConfig['db.host'],
      database: appConfig['db.database'],
      password: appConfig['db.password'],
      port: appConfig['db.port']
    });
  }

  async connect() {
    try {
      await this.client.connect();
      logger.info(`Connected to database \nDatabase config: ${this.loggableDbConfig}`)
    } catch (e) {
      logger.error(`Error trying to connect to db client \n${e} \nDatabase config: ${this.loggableDbConfig}`);
      throw new DbClientError(`Error trying to connect to db client`);
    }
  }

  async disconnect() {
    if (!this.client._connected) {
      logger.warn('Trying to disconnect from db client session that is not connected');
      return;
    }

    try {
      await this.client.end();
    } catch (e) {
      logger.warn(`Disconnecting from client errored \n${e}`);
    }

    logger.info('Disconnected from db');
  }

  async query(queryVal) {
    if (!this.client._connected) {
      logger.error('Trying to query from db client that is not connected');
      throw new DbClientError('Trying to query from db client that is not connected');
    }

    if (arguments.length < 1) {
      logger.error('Not enough arguments passed to query');
      throw new ArgumentError('Not enough arguments passed to query');
    }

    try {
      return await this.client.query(queryVal);
    } catch (e) {
      logger.error(`Error executing query \n${e}`);
      throw new DbError(`Error executing query: \n${e}`)
    }
  }

  async queryWithParams(queryString, params) {
    if (!this.client._connected) {
      logger.error('Trying to query from db client that is not connected');
      throw new DbClientError('Trying to query from db client that is not connected');
    }

    if (arguments.length < 2) {
      logger.error('Not enough arguments passed to queryWithParams');
      throw new ArgumentError('Not enough arguments passed to queryWithParams');
    }

    try {
      return await this.client.query(queryString, params);
    } catch (e) {
      logger.error(`Error executing query '${queryString}' with parameters [${params}] \n${e}`);
      throw new DbError(`Error executing query '${queryString}' with parameters [${params}]'`)
    }
  }

  async executeDbFunction(functionName, params) {
    if (!this.client._connected) {
      logger.error('Trying to execute function db client that is not connected');
      throw new DbClientError('Trying to execute function on db client that is not connected');
    }

    if (arguments.length < 2) {
      logger.error('Not enough arguments passed to executeDbFunction');
      throw new ArgumentError('Not enough arguments passed to executeDbFunction');
    }

    if (params && typeof params != 'object'){
      logger.warn(`argument 'params' must be an object; instead was of type '${typeof params}`)
      throw new ArgumentError(`argument 'params' must be an object; instead was of type '${typeof params}'`)
    }

    let namedParams = [];
    for (let key in params) {
      namedParams.push(`${key} => :${[key]}`);
    }
    namedParams = namedParams.join(', ');

    let namedQuery = named(`SELECT * FROM ${functionName}(${namedParams})`)(params);

    try {
      let result = await this.client.query(namedQuery);
      return result.rows;
    } catch (e) {
      logger.error(`Function '${functionName}' failed to execute with parameters \n[${util.inspect(params)}] \nCause: ${e}`);
      throw new DbClientError(`Function '${functionName}' with parameters \n[${util.inspect(params)}] failed to execute \nCause: ${e}`);
    }
  }

  /**
   * Get db funcitons as a 2D array of names and flatten the array to a 1D array
   */
  async getDbFunctionNames() {
    if (!this.client._connected) {
      logger.error('Trying to get db function names with db client that is not connected');
      throw new DbClientError('Trying to db function names with db client that is not connected');
    }

    try {
      let functionNames = await this.client.query({
        text: getDbFunctionNames,
        rowMode: 'array'
      });

      return functionNames.rows.join(',').split(',');
    } catch (e) {
      logger.error(`Error getting function names from db client \n${e}`);
      throw new DbClientError('Error getting function names from db client');
    }
  }

}

/**
 * Employ singleton pattern. The only accessor to an instance of DbClient
 * is through the function getDbClientInstance
 */
let dbClientInstance;

function getDbClientInstance() {
  if (!dbClientInstance) {
    dbClientInstance = new DbClient();
  }

  return dbClientInstance;
}

module.exports = { getDbClientInstance };
