CREATE FUNCTION retina.create_organization (
	name long_str_t
)
RETURNS SETOF public.organization
AS $$
  BEGIN
    RETURN QUERY
    	INSERT INTO public.organization (
    		name
    	) VALUES (
    		create_organization.name
    	) RETURNING *;
  END;
$$
LANGUAGE plpgsql;
