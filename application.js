
const { initializeDb } = require('./db-initializer');
const Server = require('./server');
const logger = require('./logger');
const appConfig = require('./app-config');
const util = require('util');

class Application {

  async start() {
    logger.info(`App Config: \n` + util.inspect(appConfig, false));

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
      logger.error(`Unable to start server. \n${e}`);
      throw new Error('Unable to start server');
    }
  }

  async shutdown() {
    await this.server.shutdown();
  }

}

module.exports = Application;
