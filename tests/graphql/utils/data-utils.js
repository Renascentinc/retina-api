
const assert = require('assert');

const { preprocessQuery, objectHasTruthyValues } = require(`../../../graphql/utils/data-utils`);

describe('graphql data-utils', () => {

  describe('preprocessQuery()', () => {

    it('should trim query, take it to lowercase, split by spaces, and sort by lexeme length', async () => {
      let query = 'A    QUERY with   Letters   ';
      let expectedLexemes = ['letters', 'query', 'with', 'a'];

      let lexemes = preprocessQuery(query);
      assert.deepEqual(lexemes, expectedLexemes);
    });

    it('should return empty string query as an empty array', async () => {
      let query = '';
      let expectedLexemes = [];

      let lexemes = preprocessQuery(query);
      assert.deepEqual(lexemes, expectedLexemes);
    });

    it('should return empty query as an empty array', async () => {
      let query = '    ';
      let expectedLexemes = [];

      let lexemes = preprocessQuery(query);
      assert.deepEqual(lexemes, expectedLexemes);
    });

  });

  describe('objectHasTruthyValues()', () => {

    it('should return true for an object with truthy values', async () => {
      let hasTruthyValues = objectHasTruthyValues({
        aKey: 'aValue',
        anotherKey: null
      });

      assert.ok(hasTruthyValues);
    });

    it('should return false for an object with only falsey values', async () => {
      let hasTruthyValues = objectHasTruthyValues({
        aKey: null
      });

      assert.ok(!hasTruthyValues);
    });

    it('should return false for an empty object', async () => {
      let hasTruthyValues = objectHasTruthyValues({});

      assert.ok(!hasTruthyValues);
    });

    it('should return false for a passed-in falsey value', async () => {
      let hasTruthyValues = objectHasTruthyValues(undefined);

      assert.ok(!hasTruthyValues);
    });

  });

});
