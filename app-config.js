const logger = require('./logger');
const util = require('util');

let appConfig = {
  'db.port': 5432,
  'db.schemaDir': `${process.env.PWD}/sql/schema`,
  'db.constraintDir': `${process.env.PWD}/sql/constraints`,
  'db.functionDir': `${process.env.PWD}/sql/functions`,
  'db.enumDir': `${process.env.PWD}/sql/enums`,
  'db.refreshSchema': false,
  'db.seed': false,

  'server.graphql.resolverDir': `${process.env.PWD}/graphql/resolvers`,
  'server.graphql.typeDefDir': `${process.env.PWD}/graphql/type_defs`,
  'server.port': process.env.PORT || 4000
}

appConfig['environment'] = process.env.ENVIRONMENT || 'local';

if (appConfig['environment'] == 'test' || appConfig['environment'] == 'local') {
  process.env['DB_USER'] = process.env.USER;
  process.env['DB_HOST'] = 'localhost';
  process.env['DB_PASSWORD'] = '';
  process.env['DB_NAME'] = 'local_db';
}

appConfig['db.user'] = process.env.DB_USER;
appConfig['db.host'] = process.env.DB_HOST;
appConfig['db.password'] = process.env.DB_PASSWORD;
appConfig['db.database'] = process.env.DB_NAME;

if (appConfig['environment'] == 'local') {
  appConfig['db.refreshSchema'] = true;
  appConfig['db.seed'] = true;
}

if (appConfig['environment'] == 'test') {
  appConfig['db.refreshSchema'] = true;
}

if (appConfig['environment'] == 'develop') {
  appConfig['db.refreshSchema'] = true;
  appConfig['db.seed'] = true;
}

logger.info(`App Config: \n` + util.inspect(appConfig, false));

module.exports = appConfig;
