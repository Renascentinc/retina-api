
CREATE FUNCTION public.get_location(
	id               id_t,
  organization_id  id_t
)
 RETURNS SETOF public.location
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM public.location
    	WHERE public.location.id = get_location.id
      AND public.location.organization_id = get_location.organization_id;
  END;
$$
LANGUAGE plpgsql;
