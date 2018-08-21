
const { initializeDb } = require('./db-initializer');
const Server = require('./server');
const logger = require('./logger');

class Application {

  async start() {
    let dbFunctions;
    try {
       dbFunctions = await initializeDb();
    } catch (e) {
      logger.error(`Unable to initialize database. \n${e}`);
      throw new Error('Unable to initialize database');
    }

    this.server = await new Server(dbFunctions);

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
