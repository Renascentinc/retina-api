module.exports = {
  getDropFunctionsQueries:
    `SELECT 'DROP FUNCTION IF EXISTS ' || ns.nspname || '.' || proname || '(' || oidvectortypes(proargtypes) || ');'
     FROM pg_proc INNER JOIN pg_namespace ns ON (pg_proc.pronamespace = ns.oid)
     WHERE ns.nspname = 'public';`,

  getDbFunctionNames:
    `SELECT DISTINCT routine_name FROM information_schema.routines
     WHERE routine_type='FUNCTION' AND specific_schema='public'`,

  getDropExtensionsQueries:
    `SELECT 'DROP EXTENSION IF EXISTS "' || extensions.extname || '";'
     FROM pg_extension as extensions
     WHERE extensions.extname != 'plpgsql'`,

  getDbTypes:
    `SELECT t.typname AS enum_name, to_json(array_agg(e.enumlabel)) AS enum_values
     FROM pg_type t
     JOIN pg_enum e ON t.oid = e.enumtypid
     GROUP BY enum_name`
}
