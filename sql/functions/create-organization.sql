CREATE FUNCTION public.create_organization (
	dd long_str_t
)
RETURNS SETOF public.organization
AS $$
  BEGIN
    RETURN QUERY
    	INSERT INTO public.organization (
    		name
    	) VALUES (
    		create_organization.dd
    	) RETURNING *;
  END;
$$
LANGUAGE plpgsql;
