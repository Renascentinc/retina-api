const { ApolloServer } = require('apollo-server');
const { initializeDb } = require('./db-initializer')
const graphQlUtils = require('./utils/graphql-utils');
const appConfig = require('./app-config');
const logger = require('./logger');

class Server {

  constructor(dbAdapter) {
    this.dbAdapter = dbAdapter;
  }

  start() {
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
