const { ApolloServer } = require('apollo-server-express');
const { initializeDb } = require('./db-initializer')
const { createSchema } = require('./utils/graphql-utils');
const appConfig = require('./app-config');
const logger = require('./logger');
const { GraphQlError } = require('./error');
const express = require('express');

function authenticate(req, res, next) {
  console.log('Authenticating...');
  next();
}

class Server {

  constructor(dbFunctions) {
    this.dbFunctions = dbFunctions;
  }

  async start() {
    let schema;
    try {
      schema = createSchema();
    } catch (e) {
      logger.error(`Trouble creating graphql schema \n${e}`);
      throw new GraphQlError('Trouble creating graphql schema');
    }

    try {
      let app = express();

      app.use(authenticate);

      let apolloServer = new ApolloServer({
        schema: schema,
        context: this.dbFunctions
      });

      apolloServer.applyMiddleware({app, path: '/graphql'});
      await app.listen(appConfig['server.port']);

      logger.info(`Started server on port ${appConfig['server.port']}`);
    } catch (e) {
      logger.error(`Unable to start server \n${e}`);
      throw new Error('Unable to start server');
    }
  }

  shutdown() { }

}

module.exports = Server;
