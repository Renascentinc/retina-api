const logger = require('./logger');
const { getAllFunctionNames } = require('./sql/raw-queries');
var named = require('yesql').pg

class DbAdapter {

  constructor(dbClient, functionNames) {
    this.dbClient = dbClient;

    functionNames.rows.forEach(row => {
      this[row[0]] = async (args) => {
        return await this.executeFunction(row[0], args);
      }
    });
  }

  async disconnect() {
    await this.dbClient.end();
  }

  async executeFunction(functionName, params) {
    if (typeof params != 'object')
    {
      throw new TypeError(`argument \'params\' must be an object; instead was of type \'${typeof params}\'`)
    }

    let namedParams = [];
    for (let key in params) {
      namedParams.push(`${key} => :${[key]}`);
    }
    namedParams = namedParams.join(', ');

    let namedQuery = named(`SELECT * FROM ${functionName}(${namedParams})`)(params);

    try {
      let result = await this.dbClient.query(namedQuery);
      return result.rows[0][functionName];
    } catch (e) {
      console.log(e);
      throw Error(`Function '${functionName}' with parameters [${namedParams}] failed to execute`);
    }
  }

}

module.exports = DbAdapter;
