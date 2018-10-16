
const { makeExecutableSchema, mergeSchemas } = require('graphql-tools');
const fileUtils = require('utils/file-utils');
const appConfig = require('app-config');
const { RequiresRoleDirective } = require('graphql/resolvers/directives/authorization');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
const { SchemaDirectiveVisitor } = require('graphql-tools');

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
  let resolvers = fileLoader(appConfig['server.graphql.resolver.schemaDir']);
  resolvers = mergeResolvers(resolvers);

  return resolvers;
}

function getSchemaDirectives() {
  let directiveResolvers = fileLoader(appConfig['server.graphql.resolver.directiveDir']);
  let directiveResolversI = mergeResolvers(directiveResolvers);
  let iggie = {};
  for (let directiveName in directiveResolversI) {
    let directive = directiveResolversI[directiveName];

    let visitorClass = class extends SchemaDirectiveVisitor {}

    for (let visitFunctionName in directive) {
      visitorClass.prototype[visitFunctionName] = createVisitorFunction(directive[visitFunctionName]);
    }

    iggie[directiveName] = visitorClass;
  }

  return iggie;
}

/**
 * The funciton returned here must be a vanilla javascript function, not a lambda
 * because with the lambda, you cannot access the `this` property of the class
 */
function createVisitorFunction(visitorFunction) {
  return function (field, fieldDetails) {
    const originalResolver = field.resolve;

    field.resolve = async (parent, resolverArgs, context, resolverMetadata) => {
      const fieldArgs = {
        field,
        fieldDetails
      };

      const resolverParams = {
        parent,
        resolverArgs,
        context,
        resolverMetadata
      };

      const directiveArgs = this.args

      const visitFunctionResult = await visitorFunction(fieldArgs, resolverParams, directiveArgs);

      if (typeof visitFunctionResult !== 'undefined') {
        return visitFunctionResult;
      }

      if (typeof originalResolver === 'function') {
        return originalResolver(parent, resolverArgs, context, resolverMetadata);
      }
    }
  }
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
