/* CREATE OR REPLACE FUNCTION public.update_tool (
  id                id_t,
	type_id						id_t,
	brand_id					id_t,
	model_number    	str_t,
	status          	status_type,
	serial_number			str_t,
	organization_id		id_t,
	date_purchased		date,
	purchased_from_id	id_t,
	price           	integer,
	photo							long_str_t,
	"year"						integer,
	user_id						id_t,
	location_id				id_t
) RETURNS SETOF public.tool
AS $$
  DECLARE
  	updated_tool_id id_t;
  BEGIN
    UPDATE public.tool
      SET
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
      WHERE public.tool.id = update_tool.id
    RETURNING id INTO updated_tool_id;

  	PERFORM create_transaction(
  		'UPDATE'::transaction_type,
  		organization_id,
  		uuid_generate_v4(),
  		updated_tool_id,
  		status, -- Jeremy, is this correct? You had 'ADD' in here before, but I think it is
							-- valid for a user to specify a tool status when creating a tool
  		null,
  		user_id,
  		null,
  		location_id,
  		null
  	);

    RETURN QUERY SELECT * FROM public.tool WHERE id = new_tool_id;
  END;
$$
LANGUAGE plpgsql; */
