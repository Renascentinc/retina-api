
CREATE FUNCTION retina.create_location (
	city							str_t,
	state 						state_t,
	zip 							zip_t,
	organization_id 	id_t,
	address_line_one	long_str_t,
  address_line_two 	long_str_t  = NULL,
	"name" 						str_t       = NULL
)
RETURNS SETOF public.location
AS $$
  BEGIN
    RETURN QUERY
    	INSERT INTO public.location (
    		city,
        state,
        zip,
        organization_id,
        address_line_one,
        address_line_two,
        name,
        type
    	) VALUES (
        city,
        state,
        zip,
        organization_id,
        address_line_one,
        address_line_two,
        name,
        'LOCATION'::tool_owner_type
    	) RETURNING *;
  END;
$$
LANGUAGE plpgsql;
