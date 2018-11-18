
let appConfig = {
  'db.port': 5432,
  'db.extensionDir': `sql/extensions`,
  'db.schemaDir': `sql/schema`,
  'db.baseSchemaDir': `sql/schema/base_schema`,
  'db.constraintDir': `sql/constraints`,
  'db.functionDir': `sql/functions`,
  'db.triggerDir': `sql/triggers`,
  'db.typeDir': `sql/types`,
  'db.viewDir': `sql/views`,
  'db.refreshSchema': false,
  'db.seed': false,
  'db.seed.tool.number': 50,
  'db.seed.user.number': 5,

  'server.graphql.schemaDir': `graphql/schema`,
  'server.graphql.typeDir': `graphql/types`,
  'server.graphql.directiveDir': `graphql/directives`,
  'server.graphql.resolver.directiveDir': `graphql/resolvers/directives`,
  'server.graphql.resolver.schemaDir': `graphql/resolvers/schema`,
  'server.graphql.resolver.scalarDir': `graphql/resolvers/scalars`,
  'server.port': process.env.PORT || 4000,

  'email.resetPassword.password': process.env.RESET_PASSWORD_EMAIL_PASSWORD,
  'email.resetPassword.address': process.env.RESET_PASSWORD_EMAIL_ADDRESS,
  'email.resetPassword.templatePath': 'templates/password-reset-email.mustache',

  'ui.url': 'http://localhost:4200'
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
