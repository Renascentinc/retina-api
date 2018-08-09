const logger = require('./logger');
const { getAllFunctionNames } = require('./sql/raw-queries');
var named = require('yesql').pg

class DbAdapter {

  constructor(dbClient, functionNames) {
    this.dbClient = dbClient;

    functionNames.forEach(name => {
      this[name] = async (params) => {
        return await this.dbClient.executeDbFunction(name, params);
      }
    });
  }

  async seedDb(dbData) {
    for (let key in dbData) {
      dbClient.query()
    }
  }

  async disconnect() {
    await this.dbClient.disconnect();
  }
}

module.exports = { DbAdapter };
