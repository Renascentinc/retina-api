CREATE FUNCTION public.create_organization (
	dd long_str_t
)
RETURNS SETOF public.organization
AS $$
  BEGIN
    RETURN QUERY
    	INSERT INTO public.organization (
    		ff
    	) VALUES (
    		create_organization.xx
    	) RETURNING *;
  END;
$$
LANGUAGE plpgsql;
