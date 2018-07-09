var express = require('express');
var router = express.Router();
const { Client } = require('pg');

/* GET home page. */
router.get('/', function(req, res, next) {
  rod().then((x) => res.send(x));
});

async function rod() {
  const client = new Client({
    database: 'test-db'
  });

  try {
    await client.connect();
    const response = await client.query('select * from helloWorld() as message');
    console.log(response);
    return response.rows[0].message;
  } catch (e) {
    console.log(e);
  }

  await client.end();
  return "a problem";
}

module.exports = router;
