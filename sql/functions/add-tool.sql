CREATE OR REPLACE FUNCTION public.add_tool (
	type_id				integer,
	brand_id			integer	,
	model_number    	char varying(80),
	status          	status_type,
	serial_number		char varying(80),
	organization_id	integer	,
	date_purchased		date              = NULL,
	purchased_from_id	integer				= NULL,
	price           	integer           = NULL,
	photo				char varying(200) = NULL,
	"year"				integer				= NULL,
	user_id				integer				= NULL,
	location_id		integer				= NULL
) RETURNS SETOF public.tool
AS $$
  DECLARE
  	new_tool public.tool;
  	new_transaction_id integer;
  BEGIN
  	  INSERT INTO public.transaction (
  	  	date,
  	  	to_user_id,
  	  	from_user_id,
  	  	to_location_id,
  	  	from_location_id,
  	  	organization_id,
  	  	"type"
  	  )
  	  VALUES (
  	  	now(),
  	  	user_id,
  	  	null,
  	  	location_id,
  	  	null,
  	  	organization_id,
  	  	'add'
  	  ) RETURNING id INTO new_transaction_id;

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
      RETURNING * INTO new_tool;

      INSERT INTO public.tool_transaction (
      	transaction_id,
      	tool_id,
      	to_status,
      	from_status
      )
      VALUES (
      	new_transaction_id,
      	new_tool.id,
      	status,
      	null
      );

  END;
$$
LANGUAGE plpgsql;
