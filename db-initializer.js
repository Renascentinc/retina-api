const { getDbClientInstance } = require('./db-client');
const appConfig = require('./app-config');
const fileUtils = require('./utils/file-utils');
const { getDropFunctionsQueries } = require('./sql/raw-queries');
const logger = require('./logger');

async function initializeDb() {

  let dbClient = getDbClientInstance();

  try {
    await dbClient.connect();
  } catch (e) {
    logger.error('Could not connect to database');
    throw e;
  }

  try {
    await dropFunctions(dbClient);
    await loadFunctions(dbClient);
  } catch (e) {
    logger.error(`Unable to drop and load functions`);
    await dbClient.disconnect();
    throw e;
  }

  let functionNames;
  try {
    functionNames = await dbClient.getDbFunctionNames();
  } catch (e) {
    logger.error(`Unable to get function names for database`);
    await dbClient.disconnect();
    throw e;
  }

  let dbFunctions = {};

  functionNames.forEach(name => {
    dbFunctions[name] = async params => {
      return await dbClient.executeDbFunction(name, params);
    }
  });

  return dbFunctions;
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

module.exports = { initializeDb }
