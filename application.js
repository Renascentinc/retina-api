
const { initializeDb } = require('./db-initializer');
const Server = require('./server');
const logger = require('./logger');

class Application {

  async start() {
    let dbAdapter;
    try {
      dbAdapter = await initializeDb();
    } catch (e) {
      logger.error('Unable to initialize database. Shutting down application');
      throw e;
    }

    this.server = await new Server(dbAdapter);

    try {
      await this.server.start();
    } catch (e) {
      logger.error('Unable to start server. Shutting down application');
      throw e;
    }
  }

  async shutdown() {
    await this.server.shutdown();
  }

}

module.exports = Application;
