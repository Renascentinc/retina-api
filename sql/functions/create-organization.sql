CREATE FUNCTION public.create_organization (
	"name" long_str_t
)
RETURNS SETOF public.organization
AS $$
  BEGIN
    RETURN QUERY
    	INSERT INTO public.organization (
    		public.name
    	) VALUES (
    		create_organization.name
    	) RETURNING *;
  END;
$$
LANGUAGE plpgsql;
