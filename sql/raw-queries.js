module.exports = {
  getDropFunctionsQueriesQuery:
    `SELECT 'DROP FUNCTION IF EXISTS ' || ns.nspname || '.' || proname || '(' || oidvectortypes(proargtypes) || ');'
     FROM pg_proc INNER JOIN pg_namespace ns ON (pg_proc.pronamespace = ns.oid)
     WHERE ns.nspname = 'public';`,

  getDropTriggersQueriesQuery:
    `SELECT 'DROP TRIGGER ' || trigger_name || ' ON public.' || event_object_table || ';'
     FROM information_schema.triggers
     WHERE trigger_schema = 'public';`,

  getDbFunctionNamesQuery:
    `SELECT DISTINCT routine_name FROM information_schema.routines
     WHERE routine_type='FUNCTION' AND specific_schema='public'`,

  getDropExtensionsQueriesQuery:
    `SELECT 'DROP EXTENSION IF EXISTS "' || extensions.extname || '";'
     FROM pg_extension as extensions
     WHERE extensions.extname != 'plpgsql'`,

  getDbTypesQuery:
    `SELECT t.typname AS enum_name, array_to_json(array_agg(e.enumlabel)) AS enum_values
     FROM pg_type t
     JOIN pg_enum e ON t.oid = e.enumtypid
     GROUP BY enum_name`
}
