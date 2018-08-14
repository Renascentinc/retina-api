const assert = require('assert');
const rewire = require('rewire');

const { createSchema }  = require(`${process.env.PWD}/utils/graphql-utils`);

describe('graphql-utils', function() {

  describe('createSchema()', function() {

    it('should return a schema', () => {
      let typeDefs = createSchema();
      assert.equal(typeof typeDefs, 'object');
    });
  });

});
