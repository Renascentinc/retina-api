const { ApolloServer } = require('apollo-server');
const { initializeDb } = require('./db-initializer')
const { createSchema } = require('./utils/graphql-utils');
const appConfig = require('./app-config');
const logger = require('./logger');
const { GraphQlError } = require('./error');
class Server {

  constructor(dbFunctions) {
    this.dbFunctions = dbFunctions;
  }

  start() {
    let schema;
    try {
      schema = createSchema();
    } catch (e) {
      logger.error(`Trouble creating graphql schema \n${e}`);
      throw new GraphQlError('Trouble creating graphql schema');
    }

    try {
      let apolloServer = new ApolloServer({
        schema: schema,
        context: this.dbFunctions
      });
      apolloServer.listen(appConfig['server.port']);
    } catch (e) {
      logger.error(`Unable to start server \n${e}`);
      throw new Error('Unable to start server');
    }
  }

  shutdown() { }

}

module.exports = Server;
