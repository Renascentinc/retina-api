const { ApolloServer } = require('apollo-server-express');
const { initializeDb } = require('./db-initializer')
const { createSchema } = require('./utils/graphql-utils');
const appConfig = require('./app-config');
const logger = require('./logger');
const { GraphQlError } = require('./error');
const express = require('express');
const bodyParser = require('body-parser');
const gql = require('graphql-tag');
const scheduler = require('node-schedule');

function tokenValid(token) {
  return token == 13;
}

function isLoginRoute(req) {
  try {
    const parsedRequest = gql(req.body.query);
    return parsedRequest.definitions.length == 1 &&
           parsedRequest.definitions[0].selectionSet.selections.length == 1 &&
           parsedRequest.definitions[0].selectionSet.selections[0].name.value == 'login'
  } catch (_) {
    return false
  }
}

function authenticate(req, res, next) {
  if (!(tokenValid(req.headers.authorization) || isLoginRoute(req))) {
    console.log("NOT VALID!!");
    next(); // DON'T do next() here in real life
  } else {
    next();
  }
}

class Server {

  constructor(dbFunctions) {
    this.dbFunctions = dbFunctions;
  }

  async start() {
    scheduler.scheduleJob({hour: 3, minute: 0, dayOfWeek: 0}, () => {
      console.log('Deleting old tokens');
    });

    let schema;
    try {
      schema = createSchema();
    } catch (e) {
      logger.error(`Trouble creating graphql schema \n${e}`);
      throw new GraphQlError('Trouble creating graphql schema');
    }

    try {
      let app = express();

      app.use(bodyParser.json());
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
