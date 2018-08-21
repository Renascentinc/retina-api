const assert = require('assert');
const rewire = require('rewire');

const { initializeDb } = require(`${process.env.PWD}/db-initializer`);

describe('db-initializer', () => {

  describe('initializeDb()', () => {

    it('should create an entirely new database', async () => {
      let _dbClient;

      try {
        let { dbClient, dbFunctions } = await initializeDb();
        _dbClient = dbClient;
      } catch (e) {
        console.log(e);
        assert.ok(false);
      }

      await _dbClient.disconnect();

    });

  });

});
