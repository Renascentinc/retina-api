const { ApolloServer } = require('apollo-server');
const { initializeDb } = require('./db-initializer')
const { createSchema } = require('./utils/graphql-utils');
const logger = require('./logger');

class Server {

  constructor(dbFuncitons) {
    this.dbFuncitons = dbAdapter;
  }

  start() {
    try {
      let apolloServer = new ApolloServer({
        schema: createSchema(),
        context: this.dbFuncitons
      });

      apolloServer.listen();
    } catch (e) {
      logger.error(`Unable to start server \n${e}`);
      throw new Error('Unable to start server');
    }
  }

  shutdown() { }

}

module.exports = Server;
