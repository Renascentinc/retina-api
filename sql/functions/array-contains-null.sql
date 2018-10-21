
/*
 * NOTE: Null checking logic pulled from https://stackoverflow.com/questions/34848009/check-if-null-exists-in-postgres-array
 */
CREATE OR REPLACE FUNCTION public.array_contains_null (
  ar anyarray
) RETURNS bool
AS $$
  BEGIN
    IF ar IS NOT NULL THEN
      RETURN array_position(ar, NULL) IS NOT NULL;
    ELSE
      RETURN false;
    END IF;
  END;
$$
LANGUAGE plpgsql;
