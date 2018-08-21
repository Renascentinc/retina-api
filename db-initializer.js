const { getDbClientInstance } = require('./db-client');
const appConfig = require('./app-config');
const fileUtils = require('./utils/file-utils');
const { createDb, loadSchema, seedDb, loadFunctions } = require('./utils/db-utils');

const logger = require('./logger');

async function initializeDb() {

  try {
    await createDb();
  } catch (e) {
    logger.error('Could not create database');
    throw e;
  }

  let dbClient = getDbClientInstance();

  try {
    await dbClient.connect();
  } catch (e) {
    logger.error('Could not connect to database');
    throw e;
  }

  try {
    await loadSchema(dbClient);

    await loadFunctions(dbClient);

    if (appConfig['db.seed']) {
      await seedDb(dbClient);
    }
  } catch (e) {
    logger.error(`Unable to initialize database`);
    await dbClient.disconnect();
    throw e;
  }

  let dbFunctions;
//   try {
//     let dbFunctions = createDbFunctions(dbClient);
//   } catch (e) {
//     logger.error('Could not get database functions');
//     await dbClient.disconnect();
//     throw e;
//   }
//
  return { dbClient, dbFunctions }
}

async function createDbFunctions(dbClient) {
  let functionNames;
  try {
    functionNames = await dbClient.getDbFunctionNames();
  } catch (e) {
    logger.error(`Unable to get function names from database`);
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





module.exports = { initializeDb }
