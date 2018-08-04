
const { gql } = require('apollo-server');
const fileUtils = require('./file-utils');

function getTypeDefsFromDirectory(dir) {
  if (!dir) {
    console.log("no dir");
    return;
  }
  let rawTypeDefs = fileUtils.readFilesFromDir(dir);

  return rawTypeDefs.map(rawTypeDef => gql(rawTypeDef));
}

function getResolversFromDirectory(dir) {
  let resolvers = require(`${process.env.PWD}/graphql/resolvers/book`);

  return resolvers;
}

module.exports = {
  getTypeDefsFromDirectory,
  getResolversFromDirectory
}
