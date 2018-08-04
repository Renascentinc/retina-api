const { ApolloServer, gql } = require('apollo-server');
const boot = require('./boot');
const logger = require('./logger');

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const db = {
  books: [
    {
      title: 'Harry Potter and the Chamber of Secrets',
      author: 'J.K. Rowling',
      waga: "dude"
    },
    {
      title: 'Jurassic Park',
      author: 'Michael Crichton',
      waga: "man"
    }
  ]
};

const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  type Book {
    title: String
    author: String
    waga: String
  }

  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
     books: async (a,b,context) => {
       let response = await context.db.hello_world({part_one: 'We have landed', part_two: 'Oh Yea'});
       return [{title: response}]
     }
  }
};

(async () => {
  let db = await boot();

  process.on('SIGTERM', () => {
    logger.silly('Closing on SIGTERM');
    db.close();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logger.silly('Closing on SIGINT');
    db.close();
    process.exit(0);
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {db}
  });

  server.listen();
  logger.verbose('Listening on port 4000')
})()


// ------------------------------------------- Db Code ------------------------------------
const { Client } = require('pg');
var named = require('yesql').pg

class Db {

  constructor() {
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
