const assert = require('assert');
const rewire = require('rewire');

const { createSchema }  = require(`utils/graphql-utils`);

describe('graphql-utils', function() {

  describe('createSchema()', function() {

    it('should successfully create a schema', () => {
      let typeDefs = createSchema();
      assert.equal(typeof typeDefs, 'object');
    });
  });

});
