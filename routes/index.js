var express = require('express');
var router = express.Router();
const { Client } = require('pg');

/* GET home page. */
router.get('/', function(req, res, next) {
  rod().then((x) => res.send(x));
});

router.get('/create', function(req, res, next) {
  arod().then((x) => res.send(x));
});

async function rod() {
  const client = new Client({
    database: 'testDb'
  });

  try {
    await client.connect();
    const response = await client.query('select * from get_tools() as message');
    console.log(response);
    return response.rows;
  } catch (e) {
    console.log(e);
  }

  await client.end();
  return "a problem";
}

async function arod() {
  const client = new Client({
    database: 'testDb'
  });

  try {
    await client.connect();
    const response = await client.query("INSERT INTO \"TestTable\" VALUES (1, 'waga')");
    console.log(response);
    return response;
  } catch (e) {
    console.log(e);
  }

  await client.end();
  return "a problem";
}

module.exports = router;
