const appConfig = require('./app-config');
const { getDbClientInstance } = require('./db-client');
const { Client } = require('pg');
const logger = require('./logger');
const fileUtils = require('./utils/file-utils');
const { devData } = require('./data/dev-data');

let localDbName = 'local_db';

let postgresDbName = 'postgres';

let cutConnectionsQuery = `SELECT pg_terminate_backend(pg_stat_activity.pid)
                           FROM pg_stat_activity
                           WHERE pg_stat_activity.datname = '${localDbName}'
                           AND pid <> pg_backend_pid();`

let dropDbQuery = `DROP DATABASE IF EXISTS ${localDbName};`;
let createDbQuery = `CREATE DATABASE ${localDbName};`;

async function createDb() {
  if (appConfig['db.database'] != localDbName) {
    logger.warn(`Trying to create db ${appConfig['db.database']}`);
    return;
  }

  logger.info(`Creating Database ...`);

  await dropAndCreateDb();
  await loadSchemaAndSeedDb();

}

//TODO Maybe improve logic so that you don't need to drop a whole db...
async function dropAndCreateDb() {
  let postgresDbClient = new Client({
    database: postgresDbName
  });

  try {
    await postgresDbClient.connect();
  } catch (e) {
    logger.warn(`Couldn't connect to postgres db \n${e}`);
    throw e;
  }

  try {
    await postgresDbClient.query(cutConnectionsQuery);
    await postgresDbClient.query(dropDbQuery);
    await postgresDbClient.query(createDbQuery);
  } catch (e) {
    logger.warn(`Couldn't drop and create database \n${e}`);
    throw e;
    await postgresDbClient.end();
  }

  await postgresDbClient.end();
}

async function loadSchemaAndSeedDb() {
  let dbClient = new Client({
    database: localDbName
  });

  try {
    await dbClient.connect();
  } catch (e) {
    logger.error('Could not connect to database');
    dbClient.end();
    throw e;
  }

  try {
    await loadSchema(dbClient);
    await seedDb(dbClient);
  } catch (e) {
    logger.warn(`Trouble loading schema or seeding db \n${e}`);
    dbClient.end();
    throw e;
  }

  await dbClient.end();
}

async function loadSchema(dbClient) {
  try {
    let schemas = fileUtils.readFilesFromDir(appConfig['db.schemaDir']);
    await dbClient.query(schemas.join(';'));
  } catch (e) {
    logger.error(`Unable to load schema into database '${dbClient.database}' \n${e}`);
    throw new Error('Unable to load schema into database');
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
        await dbClient.query(`INSERT INTO public.${tableName}(${commaDelimitedKeys}) VALUES (${vars})`, values);
      }
    }
  } catch (e) {
    logger.error(`Unable to seed database \n${e}`);
    throw new Error('Unable to seed database');
  }
}

module.exports = { createDb }
