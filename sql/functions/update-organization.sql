CREATE OR REPLACE FUNCTION public.update_organization (
	organization_id integer,
	name 						long_str_t
)
RETURNS SETOF public.organization
AS $$
  BEGIN
    RETURN QUERY
    UPDATE public.organization
    	SET
    		name = update_organization.name
    	WHERE public.organization.id = update_organization.organization_id
    RETURNING *;
  END;
$$
LANGUAGE plpgsql;
