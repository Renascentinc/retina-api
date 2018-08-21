const logger = require('./logger');
const util = require('util');

let appConfig = {
  'db.port': 5432,
  'db.schemaDir': `${process.env.PWD}/sql/schema`,
  'db.constraintDir': `${process.env.PWD}/sql/constraints`,
  'db.functionDir': `${process.env.PWD}/sql/functions`,
  'db.enumDir': `${process.env.PWD}/sql/enums`,
  'db.loadSchema': false,
  'db.dropSchema': false,
  'db.seed': false,

  'server.graphql.resolverDir': `${process.env.PWD}/graphql/resolvers`,
  'server.graphql.typeDefDir': `${process.env.PWD}/graphql/type_defs`,
  'server.port': process.env.PORT || 4000
}

if (process.env.ENVIRONMENT == undefined) {
  process.env['ENVIRONMENT'] = 'local';
  process.env['DB_USER'] = process.env.USER;
  process.env['DB_HOST'] = 'localhost';
  process.env['DB_PASSWORD'] = '';
  process.env['DB_NAME'] = 'local_db';

  appConfig['db.loadSchema'] = true;
  appConfig['db.dropSchema'] = true;
  appConfig['db.seed'] = true;
}

appConfig['environment'] = process.env.ENVIRONMENT;
appConfig['db.user'] = process.env.DB_USER;
appConfig['db.host'] = process.env.DB_HOST;
appConfig['db.password'] = process.env.DB_PASSWORD;
appConfig['db.database'] = process.env.DB_NAME;


// function getEnvironment(args) {
//   const validEnvs = ['local', 'production', 'develop'];
//
//   if (args.environment) {
//     if (validEnvs.includes(args.environment)) {
//         return args.environment;
//     } else {
//       logger.warn(`Environment variable 'environment=${args.environment}' is not valid. Using environment=local instead`)
//       return 'local';
//     }
//   } else {
//     logger.info(`Environment variable 'environment' not passed. Using environment=local`)
//     return 'local';
//   }
// }

logger.info(util.inspect(appConfig, false));

module.exports = appConfig;
