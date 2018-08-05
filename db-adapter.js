const logger = require('./logger');
const appConfig = require('./app-config');

class DbAdapter {

  constructor(dbClient) {
    this.dbClient = dbClient;
    // Do logic to decorate functions

    // Possibly put shutdown logic in here if having a "shutdown"
    // function in server is too much?
  }

  async disconnect() {
    await this.dbClient.end();
  }

}

module.exports = DbAdapter;
