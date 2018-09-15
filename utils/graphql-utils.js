
const { makeExecutableSchema, mergeSchemas } = require('graphql-tools');
const fileUtils = require('./file-utils');
const appConfig = require('../app-config');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');

function createSchema() {
  let resolvers = getResolvers();
  let typeDefs = getTypeDefs();

  return makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers
  });
}

function getResolvers() {
    let resolvers = fileLoader(appConfig['server.graphql.resolverDir']);
    resolvers = mergeResolvers(resolvers);

    return resolvers;
}

function getTypeDefs() {
  let schemaArray = fileLoader(appConfig['server.graphql.schemaDir']);
  let typesArray = fileLoader(appConfig['server.graphql.typeDir']);

  let gqlArray = schemaArray.concat(typesArray);
  let gql = mergeTypes(gqlArray, { all: true });

  return gql;
}

module.exports = {
  createSchema
}
