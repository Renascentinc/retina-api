
let rootDir = process.env.PWD;

let appConfig = {
  'rootDir': rootDir,
  'db.port': 5432,
  'db.extensionDir': `${rootDir}/sql/extensions`,
  'db.schemaDir': `${rootDir}/sql/schema`,
  'db.constraintDir': `${rootDir}/sql/constraints`,
  'db.functionDir': `${rootDir}/sql/functions`,
  'db.typeDir': `${rootDir}/sql/types`,
  'db.viewDir': `${rootDir}/sql/views`,
  'db.refreshSchema': false,
  'db.seed': false,

  'server.graphql.schemaDir': `${rootDir}/graphql/schema`,
  'server.graphql.typeDir': `${rootDir}/graphql/types`,
  'server.graphql.directiveDir': `${rootDir}/graphql/directives`,
  'server.graphql.resolver.directiveDir': `${rootDir}/graphql/resolvers/directives`,
  'server.graphql.resolver.schemaDir': `${rootDir}/graphql/resolvers/schema`,
  'server.port': process.env.PORT || 4000
}

appConfig['environment'] = process.env.ENVIRONMENT || 'local';

if (appConfig['environment'] == 'test' || appConfig['environment'] == 'local') {
  process.env['DB_USER'] = process.env.USER;
  process.env['DB_HOST'] = 'localhost';
  process.env['DB_PASSWORD'] = '';
}

if (appConfig['environment'] == 'local') {
  // appConfig['db.refreshSchema'] = true;
  // appConfig['db.seed'] = true;
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
