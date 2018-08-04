
const Db = require('./db');
const Server = require('./sserver');

class Application {

  start() {
    this.db = async new Db();
    this.server = async new Server();
    async this.server.start();
  }

  shutdown() {
    async this.db.cutConnection();
    async this.server.shutdown();
  }

}

module.exports = Application;
