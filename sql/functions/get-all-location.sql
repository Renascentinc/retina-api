
CREATE FUNCTION public.get_all_location (
	organization_id id_t
)
 RETURNS SETOF public.location
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM public.location
    	WHERE public.location.organization_id = get_all_location.organization_id;
  END;
$$
LANGUAGE plpgsql;
