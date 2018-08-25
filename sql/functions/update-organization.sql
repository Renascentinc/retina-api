CREATE OR REPLACE FUNCTION public.update_organization (
	id integer,
	name character varying(200)
)
RETURNS SETOF public.organization
AS $$
  BEGIN
    RETURN QUERY
    UPDATE public.organization
    	SET
    		name = update_organization.name
    	WHERE public.organization.id = update_organization.id
    RETURNING *;
  END;
$$
LANGUAGE plpgsql;
