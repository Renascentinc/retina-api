const { ApolloServer } = require('apollo-server');
const { initializeDb } = require('./db-initializer')
const graphQlUtils = require('./utils/graphql-utils');
const appConfig = require('./app-config');
const logger = require('./logger');

// TODO Probably remove Application and have only a server
class Server {

  start() {

    // is it really right to have db logic in server?
    try {
      this.dbAdapter = initializeDb();
    } catch (e) {
      logger.error('Unable to initialize database. Shutting down server');
      this.shutdown();
    }

    let apolloServer = new ApolloServer({
      typeDefs: graphQlUtils.getTypeDefsFromDirectory(appConfig['server.graphql.typeDefDir']),
      resolvers: graphQlUtils.getResolversFromDirectory(appConfig['server.graphql.resolverDir']),
      context: this.dbAdapter
    });

    apolloServer.listen();
  }

  shutdown() {
    this.dbAdapter.disconnect();
  }

}

module.exports = Server;
