CREATE OR REPLACE FUNCTION public.create_tool (
	type_id						id_t,
	brand_id					id_t,
	model_number    	str_t,
	status          	tool_status,
	serial_number			str_t,
	organization_id		id_t,
  owner_id				  id_t,
	date_purchased		timestamp     = NULL,
	purchased_from_id	id_t					= NULL,
	price           	integer       = NULL,
	photo							long_str_t		= NULL,
	"year"						integer				= NULL
) RETURNS SETOF public.tool
AS $$
  BEGIN
    RETURN QUERY
      INSERT INTO public.tool (
        type_id,
        brand_id,
        date_purchased,
        purchased_from_id,
        price,
        model_number,
        status,
        photo,
        "year",
        serial_number,
        organization_id,
        owner_id,
        owner_type
      )
      VALUES (
        type_id,
        brand_id,
        date_purchased,
        purchased_from_id,
        price,
        model_number,
        status,
        photo,
        "year",
        serial_number,
        organization_id,
        owner_id,
        (SELECT type from public.tool_owner where id = owner_id)
      )
      RETURNING *;
  END;
$$
LANGUAGE plpgsql;
