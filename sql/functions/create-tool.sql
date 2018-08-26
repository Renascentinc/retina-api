CREATE OR REPLACE FUNCTION public.create_tool (
	type_id						id_t,
	brand_id					id_t,
	model_number    	str_t,
	status          	status_type,
	serial_number			str_t,
	organization_id		id_t,
	date_purchased		date          = NULL,
	purchased_from_id	id_t					= NULL,
	price           	integer       = NULL,
	photo							long_str_t		= NULL,
	"year"						integer				= NULL,
	user_id						id_t					= NULL,
	location_id				id_t					= NULL
) RETURNS SETOF public.tool
AS $$
  DECLARE
  	new_tool_id id_t;
  BEGIN
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
      user_id,
      organization_id,
      location_id
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
      user_id,
      organization_id,
      location_id
    )
    RETURNING id INTO new_tool_id;

  	PERFORM create_transaction(
  		'add',
  		organization_id,
  		uuid_generate_v4(),
  		new_tool_id,
  		'Available',
  		null,
  		user_id,
  		null,
  		location_id,
  		null
  	);

    RETURN QUERY SELECT * FROM public.tool WHERE id = new_tool_id;
  END;
$$
LANGUAGE plpgsql;
