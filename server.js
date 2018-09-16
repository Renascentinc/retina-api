const { ApolloServer } = require('apollo-server-express');
const { createSchema } = require('./utils/graphql-utils');
const appConfig = require('./app-config');
const logger = require('./logger');
const { GraphQlError } = require('./error');
const express = require('express');
const bodyParser = require('body-parser');
const gql = require('graphql-tag');
const scheduler = require('node-schedule');
const uuidValidate = require('uuid-validate');
const { UserInputError, AuthenticationError } = require('apollo-server');

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

      let apolloServer = new ApolloServer({
        schema: schema,
        context: async ({req}) => {
          if (!(await this.userAuthenticated(req))) {
            throw new AuthenticationError(`User must be logged in`);
          }
          return this.dbFunctions;
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

  async userAuthenticated(req) {
    return await this.tokenValid(req.headers) || this.isLoginRoute(req)
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

  async tokenValid(headers) {
    if (!headers.authorization || typeof headers.authorization !== 'string') {
      throw new UserInputError(`No 'Authorization' header is present`);
      return false;
    }

    if (headers.authorization.lastIndexOf('Bearer ') !== 0 || headers.authorization.split(' ').length !== 2) {
      throw new UserInputError(`Authentication header '${headers.authorization}' is not a valid authorization header. It must be of the format "Bearer <your-token>"`);
    }

    let token = headers.authorization.split(' ')[1];

    if (!uuidValidate(token)) {
      throw new UserInputError(`Token '${token}' is not a valid uuid`);
    }

    let session = await this.dbFunctions.get_session_by_token({token});

    return session.length > 0;
  }

  shutdown() { }

}

module.exports = Server;
