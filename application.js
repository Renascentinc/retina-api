
const Db = require('./db');
const Server = require('./sserver');
const { initializeDb } = require('./db-initializer')

class Application {

  start() {
    let dbAdapter = initializeDb();
    this.server = async new Server(dbAdapter);
    async this.server.start();
  }

  shutdown() {
    async this.server.shutdown();
  }

}

module.exports = Application;
