const appConfig = require('../app-config');
const { getDropFunctionsQueries } = require('../sql/raw-queries');
const { Client } = require('pg');
const logger = require('../logger');
const fileUtils = require('./file-utils');
const { devData } = require('../data/dev-data');

let postgresDbName = 'postgres';

let dropTablesQuery = `DROP SCHEMA public CASCADE;
                       CREATE SCHEMA public;
                       GRANT ALL ON SCHEMA public TO public;`;

async function createDb(dbClient) {
  let postgresDbClient = new Client({
    database: postgresDbName
  });

  try {
    await postgresDbClient.connect();
  } catch (e) {
    logger.warn(`Couldn't connect to postgres db \n${e}`);
    throw e;
  }

  let existsRowResult = await postgresDbClient.query({
    text: `SELECT EXISTS (SELECT * FROM pg_database WHERE datname = '${appConfig['db.name']}')`,
    rowMode: 'array'
  });
  if (existsRowResult.rows && !existsRowResult.rows[0][0]) {
    logger.info('Creating database');
    await postgresDbClient.query(`CREATE DATABASE ${appConfig['db.name']};`);
  }

  await postgresDbClient.end();
}

async function loadSchema(dbClient) {
  try {

    if (appConfig['db.dropSchema']) {
      logger.info('Dropping Schema');
      await dropSchema(dbClient);
    }

    logger.info('Creating Enums');
    await createEnums(dbClient);

    logger.info('Creating Schema');
    await createSchema(dbClient);

    logger.info('Applying Constraints');
    await applyConstraints(dbClient);
  } catch (e) {
    logger.warn(`Trouble loading schema \n${e}`);
    dbClient.end();
    throw e;
  }
}

async function dropSchema(dbClient) {
  if (appConfig['environment'] !== 'local') {
    logger.warn('Trying to drop schema in a non-local environment');
    return;
  }

  try {
    await dbClient.query(dropTablesQuery);
  } catch (e) {
    logger.error(`Unable to drop tables from databse '${dbClient.database}' \n${e}`);
    throw new Error('Unable to drop tables from databse');
  }
}

async function createEnums(dbClient) {
  try {
    let schemas = fileUtils.readFilesFromDir(appConfig['db.enumDir']);
    await dbClient.query(schemas.join(';'));
  } catch (e) {
    logger.error(`Unable to load enums into database '${dbClient.database}' \n${e}`);
    throw new Error('Unable to load enums into database');
  }
}

async function createSchema(dbClient) {
  try {
    let schemas = fileUtils.readFilesFromDir(appConfig['db.schemaDir']);
    await dbClient.query(schemas.join(';'));
  } catch (e) {
    logger.error(`Unable to load schema into database '${dbClient.database}' \n${e}`);
    throw new Error('Unable to load schema into database');
  }
}

async function applyConstraints(dbClient) {
  try {
    let schemas = fileUtils.readFilesFromDir(appConfig['db.constraintDir']);
    await dbClient.query(schemas.join(';'));
  } catch (e) {
    logger.error(`Unable to apply constraints to database '${dbClient.database}' \n${e}`);
    throw new Error('Unable to apply constraints to database');
  }
}

async function loadFunctions(dbClient) {
  logger.info('Loading Functions');

  try {
    await dropFunctions(dbClient)
  } catch (e) {
    logger.error(`Unable to drop functions from '${dbClient.database}'`);
    throw e;
  }

  try {
    let functions = fileUtils.readFilesFromDir(appConfig['db.functionDir']);
    await dbClient.query(functions.join(';'));
  } catch (e) {
    logger.error(`Unable to load functions into database '${dbClient.database}'`);
    throw e;
  }
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

async function seedDb(dbClient) {
  logger.info('Seeding Database');

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

module.exports = { createDb, loadSchema, seedDb, loadFunctions }
