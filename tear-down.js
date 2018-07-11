
const db = require('./db');

async function tearDown(){
  await db.query('tear-down-db.sql');
}

module.exports = tearDown;
