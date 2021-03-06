module.exports = {
  getDropFunctionsQueriesQuery:
    `SELECT 'DROP FUNCTION IF EXISTS ' || ns.nspname || '.' || proname || '(' || oidvectortypes(proargtypes) || ');'
     FROM pg_proc INNER JOIN pg_namespace ns ON (pg_proc.pronamespace = ns.oid)
     WHERE ns.nspname = 'retina'
      and proname != 'is_in_service_status';`, // TODO: This is hacked because tool-snapshot relies on this function

  getDropTriggersQueriesQuery:
    `SELECT DISTINCT 'DROP TRIGGER ' || trigger_name || ' ON public.' || event_object_table || ';'
     FROM information_schema.triggers
     WHERE trigger_schema = 'public';`,

  getDbFunctionNamesQuery:
    `SELECT DISTINCT routine_name FROM information_schema.routines
     WHERE routine_type='FUNCTION'
      AND specific_schema = 'retina';`,

  getDropExtensionsQueriesQuery:
    `SELECT 'DROP EXTENSION IF EXISTS "' || extensions.extname || '";'
     FROM pg_extension as extensions
     WHERE extensions.extname != 'plpgsql'
      AND extensions.extname != 'citext';`, // TODO: This is a hack because the tables use this
                                            //       extension as part of their contract

  getDbTypesQuery:
    `SELECT t.typname AS enum_name, array_to_json(array_agg(e.enumlabel)) AS enum_values
     FROM pg_type t
     JOIN pg_enum e ON t.oid = e.enumtypid
     GROUP BY enum_name;`,

  createSchemaQuery:
    `CREATE SCHEMA IF NOT EXISTS retina;`
}
