CREATE FUNCTION retina.create_tool_snapshot (
  id                    id_t,
	type_id						    id_t,
	brand_id					    id_t,
	model_number    	    str_t,
	status          	    tool_status,
	serial_number			    str_t,
	organization_id		    id_t,
  owner_id				      id_t,
  tool_action           tool_action,
  owner_type            tool_owner_type,
  actor_id              id_t,
	date_purchased		    timestamp     = NULL,
	purchased_from_id	    id_t					= NULL,
	price           	    integer       = NULL,
	photo							    long_str_t		= NULL,
	"year"						    integer				= NULL,
  action_note           text          = NULL
) RETURNS SETOF public.tool_snapshot
AS $$
  BEGIN
    RETURN QUERY
      INSERT INTO public.tool_snapshot (
        tool_id,
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
        tool_action,
        owner_type,
        actor_id,
        action_note
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
        tool_action,
        owner_type,
        actor_id,
        action_note
      )
      RETURNING *;
  END;
$$
LANGUAGE plpgsql;
