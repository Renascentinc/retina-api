const { ApolloServer } = require('apollo-server');
const { initializeDb } = require('./db-initializer')
const { createSchema } = require('./utils/graphql-utils');
const appConfig = require('./app-config');
const logger = require('./logger');

class Server {

  constructor(dbFunctions) {
    this.dbFunctions = dbFunctions;
  }

  start() {
    try {
      let apolloServer = new ApolloServer({
        schema: createSchema(),
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
