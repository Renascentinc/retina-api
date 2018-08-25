CREATE FUNCTION public.create_organization (
	name character varying(200)
)
RETURNS SETOF public.organization
AS $$
  BEGIN
    RETURN QUERY
    	INSERT INTO public.organization (
    		name
    	) VALUES (
    		name
    	) RETURNING *;
  END;
$$
LANGUAGE plpgsql;
