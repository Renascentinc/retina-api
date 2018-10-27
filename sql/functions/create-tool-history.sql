CREATE FUNCTION public.create_tool_history (
  id                id_t,
	type_id						id_t,
	brand_id					id_t,
	model_number    	str_t,
	status          	tool_status,
	serial_number			str_t,
	organization_id		id_t,
  owner_id				  id_t,
  owner_type        tool_owner_type,
	date_purchased		date          = NULL,
	purchased_from_id	id_t					= NULL,
	price           	integer       = NULL,
	photo							long_str_t		= NULL,
	"year"						integer				= NULL
) RETURNS SETOF public.tool_history
AS $$
  BEGIN
    RETURN QUERY
      INSERT INTO public.tool_history (
        id,
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
        id,
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
      RETURNING *;
  END;
$$
LANGUAGE plpgsql;
