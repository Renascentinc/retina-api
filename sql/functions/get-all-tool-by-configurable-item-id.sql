
CREATE FUNCTION retina.get_all_tool_by_configurable_item_id (
  organization_id      id_t,
  configurable_item_id id_t
) RETURNS SETOF public.tool
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM public.tool
    	WHERE public.tool.organization_id = get_all_tool_by_configurable_item_id.organization_id
        AND retina.is_in_service_status(tool.status)
        AND get_all_tool_by_configurable_item_id.configurable_item_id
          = ANY(ARRAY[
            brand_id::integer,
            purchased_from_id::integer,
            type_id::integer
          ])
      ORDER BY tool.id;
  END;
$$
LANGUAGE plpgsql;
