

CREATE FUNCTION public.get_organization_by_name (
	organization_name str_t
)
RETURNS SETOF public.organization
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM public.organization
    	WHERE public.organization.name = get_organization_by_name.organization_name;
  END;
$$
LANGUAGE plpgsql;
