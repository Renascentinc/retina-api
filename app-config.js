
let rootDir = process.env.RETINA_API_ROOT;

let appConfig = {
  'rootDir': rootDir,
  'db.port': 5432,
  'db.extensionDir': `${rootDir}/sql/extensions`,
  'db.schemaDir': `${rootDir}/sql/schema`,
  'db.baseSchemaDir': `${rootDir}/sql/schema/base_schema`,
  'db.constraintDir': `${rootDir}/sql/constraints`,
  'db.functionDir': `${rootDir}/sql/functions`,
  'db.triggerDir': `${rootDir}/sql/triggers`,
  'db.typeDir': `${rootDir}/sql/types`,
  'db.viewDir': `${rootDir}/sql/views`,
  'db.refreshSchema': false,
  'db.seed': false,
  'db.seed.tool.number': 50,
  'db.seed.user.number': 5,

  'server.graphql.schemaDir': `${rootDir}/graphql/schema`,
  'server.graphql.typeDir': `${rootDir}/graphql/types`,
  'server.graphql.directiveDir': `${rootDir}/graphql/directives`,
  'server.graphql.resolver.directiveDir': `${rootDir}/graphql/resolvers/directives`,
  'server.graphql.resolver.schemaDir': `${rootDir}/graphql/resolvers/schema`,
  'server.graphql.resolver.scalarDir': `${rootDir}/graphql/resolvers/scalars`,
  'server.port': process.env.PORT || 4000,

  'email.resetPassword.password': rocess.env.RESET_PASSWORD_EMAIL_PASSWORD,
  'email.resetPassword.address': process.env.RESET_PASSWORD_EMAIL_ADDRESS,
  'email.resetPassword.templatePath': 'templates/password-reset-email.mustache',

  'ui.url': 'http://retina-us-east-1.s3-website.us-east-2.amazonaws.com'
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
  appConfig['ui.url'] = 'http://localhost:4200';
}

if (appConfig['environment'] == 'test') {
  appConfig['db.refreshSchema'] = true;
  process.env['DB_NAME'] = 'test_db';
}

if (appConfig['environment'] == 'develop') {
  appConfig['db.refreshSchema'] = true;
  appConfig['db.seed'] = true;
  appConfig['db.seed.tool.number'] = 400;
  appConfig['db.seed.user.number'] = 30;
  appConfig['ui.url'] = 'http://retina-develop-us-east-2.s3-website.us-east-2.amazonaws.com';
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
