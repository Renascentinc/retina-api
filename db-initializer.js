const { Client } = require('pg');
const appConfig = require('./app-config');
const fileUtils = require('./utils/file-utils');
const DbAdapter = require('./db-adapter');
const { getDropFunctionsQueries, dropAllTables, getAllFunctionNames } = require('./sql/raw-queries');
const logger = require('./logger');

//TODO: Consider making a global "query" function that will do a try/catch and log information
async function initializeDb() {
  let dbClient = getDbClient();

  try {
    await dbClient.connect();
  } catch (e) {
    logger.error('Could not connect to database');
    throw e;
  }

  try {
    await dropSchema(dbClient);
    await loadSchema(dbClient);
    await dropFunctions(dbClient);
    await loadFunctions(dbClient);
  } catch (e) {
    logger.error(`Unable to create tables and functions for database '${dbClient.database}'`);
    await dbClient.end();
    throw e;
  }

  let functionNames;
  try {
    functionNames = await getFunctionNames(dbClient);
  } catch (e) {
    logger.error(`Unable to get function names for database '${dbClient.database}'`);
    await dbClient.end();
    throw e;
  }

  return await new DbAdapter(dbClient, functionNames);
}

function getDbClient() {
  let dbClient = new Client({
    user: appConfig['db.user'],
    host: appConfig['db.host'],
    database: appConfig['db.database'],
    password: appConfig['db.password'],
    port: appConfig['db.port']
  });

  return dbClient;
}

async function dropFunctions(dbClient) {
  try {
    let dropFunctionsQueries = await dbClient.query({
      text: getDropFunctionsQueries,
      rowMode: 'array'
    });

    dropFunctionsQueries = dropFunctionsQueries.rows.map(row => row[0]).join('');
    await dbClient.query(dropFunctionsQueries);
  } catch (e) {
    logger.error(`Unable to drop functions from database '${dbClient.database}'`);
    throw e;
  }
}

async function loadFunctions(dbClient) {
  try {
    let functions = fileUtils.readFilesFromDir(appConfig['db.functionDir']);
    await dbClient.query(functions.join(';'));
  } catch (e) {
    logger.error(`Unable to load functions into database '${dbClient.database}'`);
    throw e;
  }
}

async function getFunctionNames(dbClient) {
  return await dbClient.query({
    text: getAllFunctionNames,
    rowMode: 'array'
  });
}

async function loadSchema(dbClient) {
  try {
    let schemas = fileUtils.readFilesFromDir(appConfig['db.schemaDir']);
    await dbClient.query(schemas.join(';'));
  } catch (e) {
    logger.error(`Unable to load schema into database '${dbClient.database}'`);
    throw e;
  }
}

async function dropSchema(dbClient) {
  try {
    await dbClient.query(dropAllTables);
  } catch (e) {
    logger.error(`Unable to drop schema from database '${dbClient.database}'`);
    throw e;
  }
}

module.exports = { initializeDb }
