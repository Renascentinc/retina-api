CREATE FUNCTION public.create_organization (
	"nadme" long_str_t
)
RETURNS SETOF public.organization
AS $$
  BEGIN
    RETURN QUERY
    	INSERT INTO public.organization (
    		nadme
    	) VALUES (
    		create_organization.nadme
    	) RETURNING *;
  END;
$$
LANGUAGE plpgsql;
