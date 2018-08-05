const { Client } = require('pg');
const appConfig = require('./app-config');
const DbAdapter = require('./db-adapter');
const { getDropFunctionsQueries } = require('./sql/raw-queries');

async function initializeDb() {
  if (appConfig['db.refreshSchema']) {
    // See about dropping all tables. Is a postgres connection needed?
  }

  let dbClient = getDbClient();
  await dropFunctions(dbClient);
  await loadFunctions(dbClient);
  return await new DbAdapter(dbClient);
}

async function getDbClient() {
  let dbClient = new Client({
    user: appConfig['db.user'],
    host: appConfig['db.host'],
    database: appConfig['db.database'],
    password: appConfig['db.password'],
    port: appConfig['db.port']
  });

  dbClient.connect();
  return dbClient;
}

async function dropFunctions(dbClient) {
  let dropFunctionsQueries = await dbClient.query({
    text: getDropFunctionsQueries,
    rowMode: 'array'
  });

  dropStatements = dropFunctionsQueries.rows.map(row => row[0]).join('');
  await dbClient.query(dropStatements);
}

async function loadFunctions(dbClient) {
  let functions = fileUtils.readFilesFromDir(appConfig['db.functionDir']);
  await dbClient.query(functions.join(';'));
}

module.exports = { initializeDb }
