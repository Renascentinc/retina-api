const { Client } = require('pg');
var fs = require('fs');

async function boot(){
  const client = new Client({
    database: 'test-db'
  });

  try {
    await client.connect();
    // Maybe do a foreach through the files in the sql folder to boot up the DB?
    await client.query(fs.readFileSync('sql/test-create-proc.sql', 'utf8'));
  } catch (e) {
    console.log(e);
  }

  await client.end();
};

 module.exports = boot;
