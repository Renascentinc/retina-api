CREATE OR REPLACE FUNCTION public.create_tool (
	type_id						id_t,
	brand_id					id_t,
	model_number    	str_t,
	status          	tool_status,
	serial_number			str_t,
	organization_id		id_t,
  owner_id				  id_t,
	date_purchased		date          = NULL,
	purchased_from_id	id_t					= NULL,
	price           	integer       = NULL,
	photo							long_str_t		= NULL,
	"year"						integer				= NULL
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
    RETURNING id INTO new_tool_id;

  	/* PERFORM create_transaction(
  		'ADD'::transaction_type,
  		organization_id,
  		uuid_generate_v4(),
  		new_tool_id,
  		status, -- Jeremy, is this correct? You had 'AVAILABLE' in here before, but I think it is
							-- valid for a user to specify a tool status when creating a tool
  		null,
  		user_id,
  		null,
  		location_id,
  		null
  	); */

    RETURN QUERY SELECT * FROM public.tool WHERE id = new_tool_id;
  END;
$$
LANGUAGE plpgsql;
