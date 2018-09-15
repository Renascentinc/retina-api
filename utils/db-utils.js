const appConfig = require('../app-config');
const { getDropFunctionsQueries, getDropExtensionsQueries } = require('../sql/raw-queries');
const { Client } = require('pg');
const logger = require('../logger');
const fileUtils = require('./file-utils');
const { data } = require('../data/seed-data');

//TODO: Instead of joining all the sql CREATE queries together with ';'
//      run through each query with the try/catch in the for-loop. This
//      will help with debugging

let postgresDbName = 'postgres';

let dropSchemaQuery = `DROP SCHEMA public CASCADE;
                       CREATE SCHEMA public;
                       GRANT ALL ON SCHEMA public TO public;`;

async function createDb(dbClient) {
  let postgresDbClient = new Client({
    user: appConfig['db.user'],
    host: appConfig['db.host'],
    database: postgresDbName,
    password: appConfig['db.password'],
    port: appConfig['db.port']
  });

  try {
    await postgresDbClient.connect();
  } catch (e) {
    logger.warn(`Couldn't connect to postgres db \n${e}`);
    throw e;
  }

  let existsRowResult = await postgresDbClient.query({
    text: `SELECT EXISTS (SELECT * FROM pg_database WHERE datname = '${appConfig['db.database']}')`,
    rowMode: 'array'
  });

  if (existsRowResult.rows && !existsRowResult.rows[0][0]) {
    logger.info('Creating database');
    await postgresDbClient.query(`CREATE DATABASE ${appConfig['db.database']};`);
  }


  await postgresDbClient.end();
}

async function loadSchema(dbClient) {
  try {

    if (appConfig['db.refreshSchema']) {
      logger.info('Dropping Schema');
      await dropSchema(dbClient);
    }

    logger.info('Creating Extensions');
    await createExtensions(dbClient);

    logger.info('Creating Types');
    await createTypes(dbClient);

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
  if (appConfig['environment'] != 'local' && appConfig['environment'] != 'develop' && appConfig['environment'] != 'test') {
    logger.warn('Trying to drop schema in a dis-allowed environment');
    return;
  }

  try {
    await dbClient.query(dropSchemaQuery);
  } catch (e) {
    logger.error(`Unable to drop tables from databse \n${e}`);
    throw new Error('Unable to drop tables from databse');
  }
}

async function createExtensions(dbClient) {
  try {
    let extensions = fileUtils.readFilesFromDir(appConfig['db.extensionDir']);
    await dbClient.query(extensions.join(';'));
  } catch (e) {
    logger.error(`Unable to load extensions into database \n${e}`);
    throw new Error('Unable to load extensions into database');
  }
}

async function createTypes(dbClient) {
  try {
    let types = fileUtils.readFilesFromDir(appConfig['db.typeDir']);
    await dbClient.query(types.join(';'));
  } catch (e) {
    logger.error(`Unable to load types into database \n${e}`);
    throw new Error('Unable to load types into database');
  }
}

async function createSchema(dbClient) {
  try {
    let schemas = fileUtils.readFilesFromDir(appConfig['db.schemaDir']);
    await dbClient.query(schemas.join(';'));
  } catch (e) {
    logger.error(`Unable to load schema into database  \n${e}`);
    throw new Error('Unable to load schema into database');
  }
}

async function applyConstraints(dbClient) {
  try {
    let constraints = fileUtils.readFilesFromDir(appConfig['db.constraintDir']);
    await dbClient.query(constraints.join(';'));
  } catch (e) {
    logger.error(`Unable to apply constraints to database \n${e}`);
    throw new Error('Unable to apply constraints to database');
  }
}

async function loadFunctions(dbClient) {
  logger.info('Loading Functions');

  try {
    let functions = fileUtils.readFilesFromDir(appConfig['db.functionDir']);
    await dbClient.query(functions.join(';'));
  } catch (e) {
    logger.error(`Unable to load functions into database`);
    throw e;
  }
}

async function dropExtensions(dbClient) {
  logger.info('Dropping Extensions');

  try {
    let dropExtensionsQueries = await dbClient.query({
      text: getDropExtensionsQueries,
      rowMode: 'array'
    });

    dropExtensionsQueries = dropExtensionsQueries.rows.map(row => row[0]).join('');
    await dbClient.query(dropExtensionsQueries);
  } catch (e) {
    logger.error(`Unable to drop extensions from database`);
    throw e;
  }
}

async function dropFunctions(dbClient) {
  logger.info('Dropping Functions');
  try {
    let dropFunctionsQueries = await dbClient.query({
      text: getDropFunctionsQueries,
      rowMode: 'array'
    });

    dropFunctionsQueries = dropFunctionsQueries.rows.map(row => row[0]).join('');
    await dbClient.query(dropFunctionsQueries);
  } catch (e) {
    logger.error(`Unable to drop functions from database`);
    throw e;
  }
}

async function seedDb(dbClient) {
  logger.info('Seeding Database');

  try {
    for (let tableName in data) {
      let tableRows = data[tableName];
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

module.exports = { createDb, loadSchema, seedDb, loadFunctions, dropFunctions, dropExtensions }
