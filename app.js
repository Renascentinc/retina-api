const { ApolloServer, gql } = require('apollo-server');
const boot = require('./boot');

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
    console.log('Closing on SIGTERM');
    db.close();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('Closing on SIGINT');
    db.close();
    process.exit(0);
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {db}
  });

  server.listen();
  console.log('Listening on port 4000')
})()
