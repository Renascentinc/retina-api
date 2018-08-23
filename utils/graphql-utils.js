
const { makeExecutableSchema, mergeSchemas } = require('graphql-tools');
const fileUtils = require('./file-utils');
const appConfig = require('../app-config');

function createSchema() {
  let resolvers = getResolversFromDir(appConfig['server.graphql.resolverDir']);
  let schemas = getTypeDefSchemasFromDir(appConfig['server.graphql.typeDefDir']);

  return mergeSchemas({ schemas, resolvers });
}

function getResolversFromDir(dir) {
    let resolvers = [];

    let resolverFiles = fileUtils.readFileNamesFromDir(dir);

    resolverFiles.forEach(file => {
      resolvers.push(require(`${dir}/${file}`));
    });

    return resolvers;
}

function getTypeDefSchemasFromDir(dir) {
  let typeDefs = fileUtils.readFilesFromDir(dir);

  let schemas = [];
  typeDefs.forEach(typeDef => {
    let schema = makeExecutableSchema({ typeDefs: typeDef });
    schemas.push(schema);
  });

  return schemas;
}

module.exports = {
  createSchema
}
