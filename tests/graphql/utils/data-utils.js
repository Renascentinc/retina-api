
const assert = require('assert');

const { preprocessQuery } = require(`../../../graphql/utils/data-utils`);

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

});
