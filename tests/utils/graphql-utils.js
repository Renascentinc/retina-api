const assert = require('assert');
const rewire = require('rewire');

const graphqlUtils = rewire(`${process.env.PWD}/utils/graphql-utils`);

describe('graphql-utils', function() {

  describe('getTypeDefsFromDirectory', function() {

    it('should return array of gql objects', () => {
      let typeDefs = graphqlUtils.getTypeDefsFromDirectory(`${process.env.PWD}/tests/resources/utils/dir_with_graphql_files`);
      assert.equal(typeDefs.length, 2);
      assert.equal(typeof typeDefs[0], 'object');
    });
  });

  describe('getResolversFromDirectory', function() {

    it('should return an object containing resolvers', () => {
      let typeDefs = graphqlUtils.getResolversFromDirectory('dummy_dir');
      assert.equal(typeof typeDefs, 'object');
    });

  });

});
