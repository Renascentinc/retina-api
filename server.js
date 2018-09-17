const { ApolloServer } = require('apollo-server-express');
const { createSchema } = require('./utils/graphql-utils');
const appConfig = require('./app-config');
const logger = require('./logger');
const { GraphQlError } = require('./error');
const express = require('express');
const bodyParser = require('body-parser');
const gql = require('graphql-tag');
const uuidValidate = require('uuid-validate');
const { UserInputError, AuthenticationError } = require('apollo-server');

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

      let apolloServer = new ApolloServer({
        schema: schema,
        context: async ({req}) => {
          if (typeof req.headers.authorization !== 'string') {
            if (this.isLoginRoute(req)) {
              return { db: this.dbFunctions }
            }
            throw new UserInputError(`No 'Authorization' header is present`);
          }

          let session = await this.getSessionFromAuthorizationHeader(req.headers.authorization);

          if (typeof session !== 'object') {
            throw new AuthenticationError(`Token authentication failed`);
          }

          return {
            session,
            db: this.dbFunctions
          };
        }
      });

      apolloServer.applyMiddleware({app, path: '/graphql'});
      await app.listen(appConfig['server.port']);

      logger.info(`Started server on port ${appConfig['server.port']}`);
    } catch (e) {
      logger.error(`Unable to start server \n${e}`);
      throw new Error('Unable to start server');
    }
  }

  isLoginRoute(req) {
    try {
      const parsedRequest = gql(req.body.query);
      return parsedRequest.definitions.length == 1 &&
             parsedRequest.definitions[0].selectionSet.selections.length == 1 &&
             parsedRequest.definitions[0].selectionSet.selections[0].name.value == 'login'
    } catch (_) {
      return false
    }
  }

  async getSessionFromAuthorizationHeader(authHeader) {
    if (authHeader.lastIndexOf('Bearer ') !== 0 || authHeader.split(' ').length !== 2) {
      throw new UserInputError(`Authentication header '${authHeader}' is not a valid authorization header. It must be of the format "Bearer <your-token>"`);
    }

    let token = authHeader.split(' ')[1];

    if (!uuidValidate(token)) {
      throw new UserInputError(`Token '${token}' is not a valid uuid`);
    }

    let session = await this.dbFunctions.get_session_by_token({token});

    return session[0];
  }

  shutdown() { }

}

module.exports = Server;
