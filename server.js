const { ApolloServer } = require('apollo-server');
const { createSchema } = require('./utils/graphql-utils');
const appConfig = require('./app-config');
const logger = require('./logger');
const { GraphQlError, apolloErrorFormatter} = require('error');
const gql = require('graphql-tag');
const uuidValidate = require('uuid-validate');
const { UserInputError, AuthenticationError } = require('apollo-server');

class Server {

  constructor(db) {
    this.db = db;

    // TODO: This is a hacked way of doing unauthenticated routes. We should probably be doing
    // this with directives, where we have @authenticated indicating authenticated routes,
    // and then everything else is unauthenticated
    this.unauthenticatedRoutes = ['login', 'requestPasswordReset', 'resetPassword', 'isPasswordResetCodeValid'];
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
      let server = new ApolloServer({
        schema: schema,
        formatError: apolloErrorFormatter,
        context: ({req}) => {
          if (this.isIntrospectionRequest(req))
          {
            return;
          }

          return this.getContextFromRequest(req)
        }
      });

      await server.listen(appConfig['server.port']);

      logger.info(`Started server on port ${appConfig['server.port']}`);
    } catch (e) {
      logger.error(`Unable to start server \n${e}`);
      throw new Error('Unable to start server');
    }
  }

  async getContextFromRequest(req) {
    if (typeof req.headers.authorization !== 'string') {
      if (this.isUnauthenticatedRoute(req)) {
        return { db: this.db }
      }

      throw new AuthenticationError(`No 'Authorization' header is present`);
    }

    let session = await this.getSessionFromAuthorizationHeader(req.headers.authorization);

    if (typeof session !== 'object') {
      throw new AuthenticationError(`Token authentication failed`);
    }

    return {
      session,
      db: this.db
    };
  }

  async getSessionFromAuthorizationHeader(authHeader) {
    if (authHeader.lastIndexOf('Bearer ') !== 0 || authHeader.split(' ').length !== 2) {
      throw new UserInputError(`Authentication header '${authHeader}' is not a valid authorization header. It must be of the format "Bearer <token>"`);
    }

    let token = authHeader.split(' ')[1];

    if (!uuidValidate(token)) {
      throw new UserInputError(`Token '${token}' is not a valid uuid`);
    }

    let session = await this.db.get_session_by_token({token});

    return session[0];
  }

  isUnauthenticatedRoute(req) {
    try {
      const parsedRequest = gql(req.body.query);
      return parsedRequest.definitions.length == 1 &&
             parsedRequest.definitions[0].selectionSet.selections.length == 1 &&
             this.unauthenticatedRoutes.includes(parsedRequest.definitions[0].selectionSet.selections[0].name.value)
    } catch (_) {
      return false
    }
  }

  isIntrospectionRequest(req) {
    return req.body.operationName === 'IntrospectionQuery';
  }

  shutdown() { }

}

module.exports = Server;
