
const { makeExecutableSchema, mergeSchemas } = require('graphql-tools');
const fileUtils = require('utils/file-utils');
const appConfig = require('app-config');
const { RequiresRoleDirective } = require('graphql/resolvers/directives/authorization');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
const { SchemaDirectiveVisitor } = require('graphql-tools');

function createSchema() {
  return makeExecutableSchema({
    typeDefs: getTypeDefs(),
    resolvers: getResolvers(),
    schemaDirectives: getSchemaDirectives()
  });
}

function getResolvers() {
  let schemaResolvers = fileLoader(appConfig['server.graphql.resolver.schemaDir']);
  let scalarResolvers = fileLoader(appConfig['server.graphql.resolver.scalarDir']);
  return mergeResolvers([...schemaResolvers, ...scalarResolvers]);
}

/**
 * Convert directive resolvers into a format that apollo will accept.
 *
 * For each directive name, extract the resolvers associated with that name. For
 * each of those resolvers, create a function to wrap that resolver and add the function
 * to a class that extends SchemaDirectiveVisitor. Accumulate the classes in an object
 * with the keys being the directive names; return this object
 */
function getSchemaDirectives() {
  let directiveResolversArray = fileLoader(appConfig['server.graphql.resolver.directiveDir']);
  let directiveResolversObject = mergeResolvers(directiveResolversArray);
  let directiveClasses = {};

  for (let directiveName in directiveResolversObject) {
    let directiveResolvers = directiveResolversObject[directiveName];

    let visitorClass = class extends SchemaDirectiveVisitor {}

    for (let visitFunctionName in directiveResolvers) {
      visitorClass.prototype[visitFunctionName] = createVisitorFunction(directiveResolvers[visitFunctionName]);
    }

    directiveClasses[directiveName] = visitorClass;
  }

  return directiveClasses;
}

/**
 * Create a function that will wrap the passed-in visitor function. This created
 * function takes care of the implementation details of apollo's implementation of
 * directive resolvers.
 *
 * The created function first stores the original resolver for the annotated field. It
 * then sets the field's `resolve` property to a function that calls the visitorFunction
 * with all the properties the visitor function might need. Then, if the visitorFunction
 * returned anything, that value is returned. Else, the result of the original resolver is
 * returned, if the original resolver was defined.
 *
 * NOTE! -> The funciton returned here must be a vanilla javascript function, not a lambda,
 * because with the lambda, you cannot access the `this` property of any class this
 * function is attached to.
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

  let gqlArray = [...schemaArray, ...typesArray, ...directivesArray];

  return mergeTypes(gqlArray, { all: true });
}

module.exports = {
  createSchema
}
