
const { makeExecutableSchema, mergeSchemas } = require('graphql-tools');
const fileUtils = require('./file-utils');
const appConfig = require('../app-config');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');

function createSchema() {
  let resolvers = getResolvers();
  let typeDefs = getTypeDefs();
  let schemaDirectives = getSchemaDirectives();

  return makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives
  });
}

function getResolvers() {
    let resolvers = fileLoader(appConfig['server.graphql.resolverDir'], { recursive: true });
    resolvers = mergeResolvers(resolvers);

    return resolvers;
}

function getSchemaDirectives() {
  let 
}

function getTypeDefs() {
  let schemaArray = fileLoader(appConfig['server.graphql.schemaDir']);
  let typesArray = fileLoader(appConfig['server.graphql.typeDir']);
  let directivesArray = fileLoader(appConfig['server.graphql.directiveDir']);

  let gqlArray = [].concat(schemaArray, typesArray, directivesArray);
  let gql = mergeTypes(gqlArray, { all: true });

  return gql;
}

module.exports = {
  createSchema
}
