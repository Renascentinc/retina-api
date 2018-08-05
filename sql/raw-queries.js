module.exports = {
  getDropFunctionsQueries:
    `SELECT 'DROP FUNCTION IF EXISTS ' || ns.nspname || '.' || proname || '(' || oidvectortypes(proargtypes) || ');'
     FROM pg_proc INNER JOIN pg_namespace ns ON (pg_proc.pronamespace = ns.oid)
     WHERE ns.nspname = 'public';`,

  dropAllTables:
    `DROP SCHEMA public CASCADE;
     CREATE SCHEMA public;
     GRANT ALL ON SCHEMA public TO public;`,

  getAllFunctionNames:
    `SELECT DISTINCT routine_name FROM information_schema.routines
     WHERE routine_type='FUNCTION' AND specific_schema='public'`
}
