const { Client } = require('pg');
var named = require('yesql').pg

class Db {

  constructor(connection) {
    this.connection = connection;
  }

  async execute_stored_procedure(procedureName, params) {
    if (typeof params != 'object')
    {
      throw new TypeError(`argument \'params\' must be an object; instead was of type \'${typeof params}\'`)
    }

    let namedParams = [];
    for (let key in params) {
      namedParams.push(`${key} => :${[key]}`);
    }
    namedParams = namedParams.join(', ');

    let namedQuery = named(`SELECT * FROM ${procedureName}(${namedParams})`)(params);

    try {
      let result = await this.connection.query(namedQuery);
      return result.rows[0][procedureName];
    } catch (e) {
      console.log(e);
      throw Error(`Query '${namedQuery.text}' with values [${namedQuery.values}] failed to execute`);
    }
  }

  async rawQuery(query) {
    return await this.connection.query(query);
  }

  async open() {
    await this.connection.connect();
  }

  async close() {
    await this.connection.end();
  }
}

class DbBuilder {

  withDbConnection(dbConnection) {
    this.dbConnection = dbConnection;
    return this;
  }

  async build() {
    if (typeof this.dbConnection != 'object' || this.dbConnection == null) {
      throw Error(`An incorrect database client was provided`);
    }
    let db = new Db(this.dbConnection);

    db.open();

    let functionNames = await db.rawQuery({
      text: `SELECT DISTINCT routine_name FROM information_schema.routines
             WHERE routine_type='FUNCTION' AND specific_schema='public'`,
      rowMode: 'array'
    });

    // Smelly code here, calling db versus this
    functionNames.rows.forEach(row => {
      db[row[0]] = async (args) => {
        return await db.execute_stored_procedure(row[0], args);
      }
    });

    return db;
  }
}

module.exports = { DbBuilder };
