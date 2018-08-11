

CREATE FUNCTION public.get_tools()
 RETURNS SETOF public.tool
AS $$
  BEGIN
    RETURN QUERY SELECT * FROM public.tool;
  END;
$$
LANGUAGE plpgsql;
