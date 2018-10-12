// 
let appConfig = {
  'db.port': 5432,
  'db.extensionDir': `${process.env.PWD}/sql/extensions`,
  'db.schemaDir': `${process.env.PWD}/sql/schema`,
  'db.constraintDir': `${process.env.PWD}/sql/constraints`,
  'db.functionDir': `${process.env.PWD}/sql/functions`,
  'db.typeDir': `${process.env.PWD}/sql/types`,
  'db.viewDir': `${process.env.PWD}/sql/views`,
  'db.refreshSchema': false,
  'db.seed': false,

  'server.graphql.resolverDir': `${process.env.PWD}/graphql/resolvers`,
  'server.graphql.schemaDir': `${process.env.PWD}/graphql/schema`,
  'server.graphql.typeDir': `${process.env.PWD}/graphql/types`,
  'server.port': process.env.PORT || 4000
}

appConfig['environment'] = process.env.ENVIRONMENT || 'local';

if (appConfig['environment'] == 'test' || appConfig['environment'] == 'local') {
  process.env['DB_USER'] = process.env.USER;
  process.env['DB_HOST'] = 'localhost';
  process.env['DB_PASSWORD'] = '';
}

if (appConfig['environment'] == 'local') {
  appConfig['db.refreshSchema'] = true;
  appConfig['db.seed'] = true;
  process.env['DB_NAME'] = 'local_db';
}

if (appConfig['environment'] == 'test') {
  appConfig['db.refreshSchema'] = true;
  process.env['DB_NAME'] = 'test_db';
}

if (appConfig['environment'] == 'develop') {
  appConfig['db.refreshSchema'] = true;
  appConfig['db.seed'] = true;
}

if (appConfig['environment'] == 'release') {
  appConfig['db.refreshSchema'] = true;
  appConfig['db.seed'] = true;
}

appConfig['db.user'] = process.env.DB_USER;
appConfig['db.host'] = process.env.DB_HOST;
appConfig['db.password'] = process.env.DB_PASSWORD;
appConfig['db.database'] = process.env.DB_NAME;

module.exports = appConfig;
