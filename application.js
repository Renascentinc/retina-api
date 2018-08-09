
const { initializeDb } = require('./db-initializer');
const Server = require('./server');
const logger = require('./logger');
const devData = require('./dev-data');

class Application {

  async start() {
    let dbAdapter;
    try {
      dbAdapter = await initializeDb();
      await dbAdapter.seedDb();
    } catch (e) {
      logger.error(`Unable to initialize database. ${e}`);
      throw new Error('Unable to initialize database');
    }

    this.server = await new Server(dbAdapter);

    try {
      await this.server.start();
    } catch (e) {
      logger.error(`Unable to start server. ${e}`);
      throw new Error('Unable to start server');
    }
  }

  async shutdown() {
    await this.server.shutdown();
  }

}

module.exports = Application;
