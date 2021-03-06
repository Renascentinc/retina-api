CREATE OR REPLACE FUNCTION retina.update_tool (
  id                id_t,
	type_id						id_t,
	brand_id					id_t,
	model_number    	str_t,
	status          	tool_status,
	serial_number			str_t,
	organization_id		id_t,
  owner_id  				id_t,
	date_purchased		timestamp  = NULL,
	purchased_from_id	id_t       = NULL,
	price           	integer    = NULL,
	photo							long_str_t = NULL,
	"year"						integer    = NULL,
  tagged            boolean    = false
) RETURNS SETOF public.tool
AS $$
  DECLARE
  	updated_tool_id id_t;
  BEGIN
    UPDATE public.tool
      SET
        type_id           = update_tool.type_id,
        brand_id          = update_tool.brand_id,
        date_purchased    = update_tool.date_purchased,
        purchased_from_id = update_tool.purchased_from_id,
        price             = update_tool.price,
        model_number      = update_tool.model_number,
        status            = update_tool.status,
        photo             = update_tool.photo,
        "year"            = update_tool.year,
        serial_number     = update_tool.serial_number,
        owner_id          = update_tool.owner_id,
        tagged            = update_tool.tagged
      WHERE public.tool.id = update_tool.id
        AND public.tool.organization_id = update_tool.organization_id
        AND retina.is_in_service_status(tool.status)
    RETURNING public.tool.id INTO updated_tool_id;

    RETURN QUERY SELECT * FROM public.tool WHERE public.tool.id = updated_tool_id;
  END;
$$
LANGUAGE plpgsql;
