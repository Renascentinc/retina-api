

CREATE FUNCTION public.get_organization(
	id integer
)
 RETURNS SETOF public.organization
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM public.organization
    	WHERE public.organization.id = get_organization.id;
  END;
$$
LANGUAGE plpgsql;
