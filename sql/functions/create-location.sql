
/* CREATE FUNCTION public.create_location (
  id serial PRIMARY KEY
  "name" character varying(80),
  address_line_one character varying(200)
  address_line_two character varying(200),
  city character varying(80),
  state character varying(2),
  zip character varying(10),
  organization_id
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
LANGUAGE plpgsql; */
