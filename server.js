const { ApolloServer } = require('apollo-server');
const { initializeDb } = require('./db-initializer')
const { createSchema } = require('./utils/graphql-utils');
const logger = require('./logger');

class Server {

  constructor(dbAdapter) {
    this.dbAdapter = dbAdapter;
  }

  start() {
    try {
      let apolloServer = new ApolloServer({
        schema: createSchema(),
        context: this.dbAdapter
      });

      apolloServer.listen();
    } catch (e) {
      logger.error(`Unable to start server \n${e}`);
      this.dbAdapter.disconnect();
      throw new Error('Unable to start server');
    }
  }

  shutdown() { }

}

module.exports = Server;
