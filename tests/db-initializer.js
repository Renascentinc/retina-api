const assert = require('assert');
const rewire = require('rewire');

const { initializeDb } = require(`${process.env.PWD}/db-initializer`);

describe('db-initializer', () => {

  describe('initializeDb()', () => {

    it('should create an entirely new database', async () => {
      try {
        let dbAdapter = await initializeDb();
        // await dbAdapter.disconnect();
      } catch (e) {
        console.log(e)
      }

    });

  });

});
