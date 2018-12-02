

CREATE FUNCTION retina.get_organization(
	organization_id id_t
)
 RETURNS SETOF public.organization
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM public.organization
    	WHERE public.organization.id = get_organization.organization_id;
  END;
$$
LANGUAGE plpgsql;
