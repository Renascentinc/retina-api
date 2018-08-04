const assert = require('assert');
const rewire = require('rewire');

const Server = rewire(`${process.env.PWD}/server`);

describe('server', function() {

  describe('Server.start', function() {

    it('should boot a working apollo server', () => {
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

      let server = new Server(db);
      server.start();
    });

  });

});
