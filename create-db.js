const appConfig = require('./app-config');
const { getDbClientInstance } = require('./db-client');
const { Client } = require('pg');
const logger = require('./logger');
const fileUtils = require('./utils/file-utils');
const { devData } = require('./data/dev-data');

let localDbName = 'local_db';

let postgresDbName = 'postgres';

let dropTablesQuery = `DROP SCHEMA public CASCADE;
                       CREATE SCHEMA public;
                       GRANT ALL ON SCHEMA public TO public;`;

let createDbQuery = `CREATE DATABASE ${localDbName};`;

let dbExists = `SELECT EXISTS (SELECT * FROM pg_database WHERE datname = '${localDbName}')`;

async function createDb() {
  if (appConfig['db.database'] != localDbName) {
    logger.warn(`Trying to create db ${appConfig['db.database']}`);
    return;
  }

  await createDbIfNotExists();
  await loadSchemaAndSeedDb();

}

//TODO Maybe improve logic so that you don't need to drop a whole db
async function createDbIfNotExists() {
  let postgresDbClient = new Client({
    database: postgresDbName
  });

  try {
    await postgresDbClient.connect();
  } catch (e) {
    logger.warn(`Couldn't connect to postgres db \n${e}`);
    throw e;
  }

  let existsRowResult = await postgresDbClient.query({text: dbExists, rowMode: 'array'});
  if (existsRowResult.rows && !existsRowResult.rows[0][0]) {
    logger.info('Creating databse');
    await postgresDbClient.query(createDbQuery);
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
    logger.info('Dropping Schema');
    await dropSchema(dbClient);

    logger.info('Loading Schema');
    await loadSchema(dbClient);

    logger.info('Applying Constraints');
    await applyConstraints(dbClient);

    await logger.info('Seeding database');
    await seedDb(dbClient);
  } catch (e) {
    logger.warn(`Trouble loading schema or seeding db \n${e}`);
    dbClient.end();
    throw e;
  }

  await dbClient.end();
}

async function dropSchema(dbClient) {
  try {
    await dbClient.query(dropTablesQuery);
  } catch (e) {
    logger.error(`Unable to drop tables from databse '${dbClient.database}' \n${e}`);
    throw new Error('Unable to drop tables from databse');
  }
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

async function applyConstraints(dbClient) {
  try {
    let schemas = fileUtils.readFilesFromDir(appConfig['db.constraintDir']);
    await dbClient.query(schemas.join(';'));
  } catch (e) {
    logger.error(`Unable to apply constraints to database '${dbClient.database}' \n${e}`);
    throw new Error('Unable to apply constraints to database');
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
