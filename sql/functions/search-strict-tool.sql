CREATE OR REPLACE FUNCTION public.search_strict_tool (
 )
RETURNS SETOF public.tool
AS $$
  DECLARE
  query text = '';
  BEGIN

    IF 1 = 1 THEN
    	query = query || 'SELECT * FROM public.tool';
    END IF;

    RETURN QUERY EXECUTE query;

  END;
$$
LANGUAGE plpgsql;
