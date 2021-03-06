const { Client } = require('pg');
var named = require('yesql').pg
const appConfig = require('./app-config');
const { ArgumentError, DbClientError } = require('./error.js')
const { getDbFunctionNamesQuery, getDbTypesQuery } = require('./sql/raw-queries');
const logger = require('./logger');
const util = require('util');
const PgError = require("pg-error")

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

    this.client.connection.parseE = PgError.parse
    this.client.connection.parseN = PgError.parse

    this.client.connection.on("PgError", function(err) {
      switch (err.severity) {
        case "ERROR":
        case "FATAL":
        case "PANIC": return this.emit("error", err)
        default: return this.emit("notice", err)
      }
    })
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
      throw (e instanceof PgError) ? e : new DbClientError(e);
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
      logger.error(`Error executing query '${queryString}' with parameters ${params} \n${e}`);
      throw (e instanceof PgError) ? e : new DbClientError(e);
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
      logger.warn(`argument 'params' must be an object; instead was of type '${typeof params}'`)
      throw new ArgumentError(`argument 'params' must be an object; instead was of type '${typeof params}'`)
    }

    let namedParams = [];
    for (let key in params) {
      namedParams.push(`"${key}" := :${[key]}`);
    }
    namedParams = namedParams.join(', ');

    let namedQuery = named(`SELECT * FROM ${functionName}(${namedParams})`)(params);

    try {
      let result = await this.client.query(namedQuery);
      return result.rows;
    } catch (e) {
      logger.error(`Function '${functionName}' failed to execute with parameters \n${util.inspect(params)} \nCause: ${e}`);
      throw (e instanceof PgError) ? e : new DbClientError(e);
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
        text: getDbFunctionNamesQuery,
        rowMode: 'array'
      });

      return functionNames.rows.join(',').split(',');
    } catch (e) {
      logger.error(`Error getting function names from db client \n${e}`);
      throw new DbClientError('Error getting function names from db client');
    }
  }

  /**
   * Collect all the enum types from the db and their possible values
   *
   * @returns {Object { enum_name: Array[enum_value] }} - object with enum names mapping to array of possible values
   */
  async getDbTypes() {
    let dbTypes = await this.client.query({
      text: getDbTypesQuery
    });

    let dbTypesObject = {};

    dbTypes.rows.forEach(dbType => {
      dbTypesObject[dbType.enum_name] = dbType.enum_values
    });

    return dbTypesObject;
  }

}

/**
 * Employ singleton pattern. The instance of DbClient is dbClient;
 */
let dbClient = new DbClient();

module.exports = { dbClient };
