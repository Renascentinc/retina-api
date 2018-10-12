CREATE OR REPLACE FUNCTION public.create_transaction (
	"type"				     transaction_type,
	organization_id	   id_t,
	transaction_id     uuid_t,
	tool_id            id_t,
	to_status			     tool_status    	= NULL,
	from_status        tool_status    	= NULL,
	to_user_id         id_t 						= NULL,
	from_user_id       id_t 						= NULL,
	to_location_id     id_t 						= NULL,
	from_location_id   id_t 						= NULL
) RETURNS void
AS $$
  BEGIN
    INSERT INTO public.transaction (
      date,
      "type",
      organization_id,
      transaction_id,
      tool_id,
			to_status,
			from_status,
			to_user_id,
			from_user_id,
			to_location_id,
			from_location_id
  	)
  	VALUES (
  	  now(),
  	  "type",
  	  organization_id,
  	  transaction_id,
  	  tool_id,
  	  to_status,
  	  from_status,
  	  to_user_id,
  	  from_user_id,
  	  to_location_id,
  	  from_location_id
  	);
  END;
$$
LANGUAGE plpgsql;
