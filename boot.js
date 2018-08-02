const { Client } = require('pg');
const { DbBuilder } = require('./db');
const fs = require('fs');

async function deleteFunctionsFromDb(db) {
  let dropStatements = await db.rawQuery({
    text: `SELECT 'DROP FUNCTION IF EXISTS ' || ns.nspname || '.' || proname || '(' || oidvectortypes(proargtypes) || ');'
           FROM pg_proc INNER JOIN pg_namespace ns ON (pg_proc.pronamespace = ns.oid)
           WHERE ns.nspname = 'public';`,
    rowMode: 'array'
  });

  dropStatements = dropStatements.rows.map(row => row[0]).join('');
  try {
    await db.rawQuery(dropStatements);
  } catch (e) {
    console.log(e)
  }
}

async function loadFunctionsIntoDb(db) {
  let files = fs.readdirSync('./sql/functions');

  let fileTexts = [];
  for (let i in files) {
    fileTexts.push(fs.readFileSync(`./sql/functions/${files[i]}`, {encoding: 'utf-8'}));
  }

  try {
    await db.rawQuery(fileTexts.join(';'));
  } catch (e) {
    console.log(e)
  }
}

// So far only local configuration
async function boot(){
  let connection = new Client({
    database: 'test-db'
  });

  let db = await new DbBuilder()
                      .withDbConnection(connection)
                      .build();

  try {
    await deleteFunctionsFromDb(db);
    await loadFunctionsIntoDb(db);
  } catch (e) {
    console.log(e);
  }

  return db;
};

module.exports = boot;
