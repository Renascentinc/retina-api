const { getDbClientInstance } = require('./db-client');
const appConfig = require('./app-config');
const fileUtils = require('./utils/file-utils');
const { DbAdapter } = require('./db-adapter');
const { getDropFunctionsQueries, dropAllTables, getAllFunctionNames } = require('./sql/raw-queries');
const logger = require('./logger');
const { devData } = require('./data/dev-data');

async function initializeDb() {

  let dbClient = getDbClientInstance();

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
    await seedDb(dbClient);
  } catch (e) {
    logger.error(`Unable to create tables and functions for database`);
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

  return await new DbAdapter(dbClient, functionNames);
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

async function loadSchema(dbClient) {
  try {
    let schemas = fileUtils.readFilesFromDir(appConfig['db.schemaDir']);
    await dbClient.query(schemas.join(';'));
  } catch (e) {
    logger.error(`Unable to load schema into database '${dbClient.database}' \n${e}`);
    throw e;
  }
}

async function dropSchema(dbClient) {
  try {
    await dbClient.query(`DROP SCHEMA public CASCADE;
                          CREATE SCHEMA public;
                          GRANT ALL ON SCHEMA public TO public;`);
  } catch (e) {
    logger.error(`Unable to drop schema from database '${dbClient.database}' \n${e}`);
    throw new Error('Unable to drop schema from database');
  }
}

async function seedDb(dbClient) {
  try {
    for (let tableName in devData) {
      let tableRows = devData[tableName];
      for (let rowIndex in tableRows) {
        let keys = Object.keys(tableRows[rowIndex]);
        let values = Object.values(tableRows[rowIndex]);
        let commaDelimitedKeys = keys.join(',');

        let vars = [];
        for (var i = 0; i < values.length; i++) {
          vars.push(`$${i+1}`);
        }
        vars = vars.join(',');
        await dbClient.queryWithParams(`INSERT INTO public.${tableName}(${commaDelimitedKeys}) VALUES (${vars})`, values);
      }
    }
  } catch (e) {
    logger.error(`Unable to seed database \n${e}`);
    throw new Error('Unable to seed database');
  }
}

module.exports = { initializeDb }
