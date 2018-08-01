const { Client } = require('pg');
const db = require('./db');
var fs = require('fs');

async function boot(){
  const bootClient = new Client({
    database: 'postgres'
  });

  try {
    await bootClient.connect();
    // Maybe do a foreach through the files in the sql folder to boot up the DB?
    await bootClient.query(fs.readFileSync('sql/create-db.sql', 'utf8'));
  } catch (e) {
    console.log(e);
  }

  await bootClient.end();

  try {
    await db.query('test-create-table.sql');
    await db.query('test-create-proc.sql');
  } catch (e) {
    console.log(e);
  }
};

 module.exports = boot;
