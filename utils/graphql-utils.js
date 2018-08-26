
const { makeExecutableSchema, mergeSchemas } = require('graphql-tools');
const fileUtils = require('./file-utils');
const appConfig = require('../app-config');

function createSchema() {
  let resolvers = getResolversFromDir(appConfig['server.graphql.resolverDir']);
  let schemas = getSchemas();

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

function getSchemas() {
  let typeDefs = fileUtils.readFilesFromDir(appConfig['server.graphql.schemaDir']);
  // typeDefs = typeDefs.concat(fileUtils.readFilesFromDir(appConfig['server.graphql.typesDir']));

  // typeDefs = typeDefs.join('\n');


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
