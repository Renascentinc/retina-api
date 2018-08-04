const { ApolloServer } = require('apollo-server');
const graphQlUtils = require('./utils/graphql-utils');
const appConfig = require('./app-config');

class Server {

  constructor(db) {
    this.db = db;
  }

  start() {
    let server = new ApolloServer({
      typeDefs: graphQlUtils.getTypeDefsFromDirectory(appConfig['server.graphql.typeDefDir']),
      resolvers: graphQlUtils.getResolversFromDirectory(appConfig['server.graphql.resolverDir']),
      context: this.db
    });

    server.listen();
  }

  shutdown() {

  }

}

module.exports = Server;
