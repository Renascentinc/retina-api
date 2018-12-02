CREATE FUNCTION retina.get_all_organization()
 RETURNS SETOF public.organization
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM public.organization;
  END;
$$
LANGUAGE plpgsql;
