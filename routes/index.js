var express = require('express');
var router = express.Router();
const { Client } = require('pg');

/* GET home page. */
router.get('/', function(req, res, next) {
  rod().then((x) => res.send(x));
});

async function rod() {
  const client = new Client({
    // user: 'dbuser',
    // host: 'localhost',
    database: 'test-db',
    // password: 'secretpassword',
    // port: 3211,
  });

  try {
    await client.connect();
    const response = await client.query('SELECT $1::text as message', ['Hello world!']);
    console.log(response.rows[0].message);
    return response.rows[0].message;
  } catch (e) {
    console.log(e);
  }

  await client.end();
  return "a problem";
}

module.exports = router;
