
CREATE FUNCTION retina.get_location(
	location_id      id_t,
  organization_id  id_t
)
 RETURNS SETOF public.location
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM public.location
    	WHERE public.location.id = get_location.location_id
      AND public.location.organization_id = get_location.organization_id;
  END;
$$
LANGUAGE plpgsql;
