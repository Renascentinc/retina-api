const { dbClient } = require('./db-client');
const appConfig = require('./app-config');
const fileUtils = require('./utils/file-utils');
const { createDb,
        loadSchema,
        seedDb,
        loadFunctions,
        dropFunctions,
        dropExtensions,
        loadTriggers,
        dropTriggers,
        dropSchema } = require('./utils/db-utils');

const Enum = require('enums');
const logger = require('./logger');

async function initializeDb() {

  try {
    await createDb();
  } catch (e) {
    logger.error('Could not create database');
    throw e;
  }

  try {
    await dbClient.connect();
  } catch (e) {
    logger.error('Could not connect to database');
    throw e;
  }

  try {

    if (appConfig['db.refreshSchema']) {
      logger.info('Dropping Schema');
      await dropSchema(dbClient);
    }

    await dropTriggers(dbClient);

    await dropFunctions(dbClient);

    await dropExtensions(dbClient);

    await loadSchema(dbClient);

    await loadTriggers(dbClient);

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
  try {
    dbFunctions = await createDbFunctions(dbClient);
  } catch (e) {
    logger.error('Could not get database functions');
    await dbClient.disconnect();
    throw e;
  }

  let dbTypes;
  try {
    dbTypes = await createDbTypes(dbClient);
  } catch (e) {
    logger.error('Could not get database types');
    await dbClient.disconnect();
    throw e;
  }

  return { ...dbFunctions, ...dbTypes};
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
      return await dbClient.executeDbFunction(`retina.${name}`, params);
    }
  });

  return dbFunctions;
}

async function createDbTypes(dbClient) {
  logger.info('Collecting Db Types')
  let dbTypes = await dbClient.getDbTypes();

  for (let enumName in dbTypes) {
    dbTypes[enumName] = new Enum(dbTypes[enumName]);
  }

  return dbTypes;
}

module.exports = { initializeDb }
