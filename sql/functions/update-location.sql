CREATE OR REPLACE FUNCTION public.update_location (
  id                id_t,
  city							str_t,
	state 						state_t,
	zip 							zip_t,
	organization_id 	id_t,
	address_line_one	long_str_t,
  address_line_two 	long_str_t,
	"name" 						str_t
)
RETURNS SETOF public.location
AS $$
  BEGIN
    RETURN QUERY
    UPDATE public.location
    	SET
        city             = update_location.city,
        state            = update_location.state,
        zip              = update_location.zip,
        address_line_one = update_location.address_line_one,
        address_line_two = update_location.address_line_two,
        "name"           = update_location.name
    	WHERE public.location.id = update_location.id
       AND public.location.organization_id = update_location.organization_id
    RETURNING *;
  END;
$$
LANGUAGE plpgsql;
