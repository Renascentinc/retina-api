const { Client } = require('pg');
const fs = require('fs');

async function query(file){
  const client = new Client({
    database: 'testDb'
  });

  client.connect();

  try {
    var result = await client.query(fs.readFileSync(`sql/${file}`, 'utf8'));
    await client.end();
    return result
  } catch (e) {
    console.log(e);
    await client.end();
  }
}

module.exports = { query };
