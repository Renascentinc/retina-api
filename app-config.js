const logger = require('./logger');

let configSet = false;

let appConfig = {
  'db.port': 5432,
  'db.schemaDir': `${process.env.PWD}/sql/schema`,
  'db.constraintDir': `${process.env.PWD}/sql/constraints`,
  'db.functionDir': `${process.env.PWD}/sql/functions`,
  'db.create': false,

  'server.graphql.resolverDir': `${process.env.PWD}/graphql/resolvers`,
  'server.graphql.typeDefDir': `${process.env.PWD}/graphql/type_defs`
}

if (!configSet) {
  setConfig(require('minimist')(process.argv.slice(2)));
  configSet = true;
}

function setConfig(args) {
  let environment = getEnvironment(args);
  appConfig['environment'] = environment;

  if (environment == 'local') {
    appConfig['db.user'] = process.env.USER;
    appConfig['db.host'] = 'localhost';
    appConfig['db.password'] = '';
    appConfig['db.database'] = 'local_db';
    appConfig['db.create'] = true;
  }

  if (environment == 'production') {
    appConfig['db.user'] = 'awsUser';
    appConfig['db.host'] = 'awsHost';
    appConfig['db.password'] = 'awsPwd';
    appConfig['db.database'] = 'awsDb';
  }

  if (environment == 'develop') {
    appConfig['db.user'] = 'devUser';
    appConfig['db.host'] = 'devHost';
    appConfig['db.password'] = 'devPwd';
    appConfig['db.database'] = 'devDb';
  }

}

function getEnvironment(args) {
  const validEnvs = ['local', 'production', 'develop'];

  if (args.environment) {
    if (validEnvs.includes(args.environment)) {
        return args.environment;
    } else {
      logger.warn(`Environment variable 'environment=${args.environment}' is not valid. Using environment=local instead`)
      return 'local';
    }
  } else {
    logger.info(`Environment variable 'environment' not passed. Using environment=local`)
    return 'local';
  }
}

module.exports = appConfig;
