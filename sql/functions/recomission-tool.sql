
CREATE OR REPLACE FUNCTION public.recomission_tool(
  organization_id      id_t,
	tool_id              id_t,
  recomissioned_status in_service_tool_status
)
RETURNS SETOF public.tool
AS $$
  BEGIN
    RETURN QUERY
  		UPDATE tool
        SET status = recomission_tool.recomissioned_status::text::tool_status
          WHERE tool.id = recomission_tool.tool_id
            AND tool.organization_id = recomission_tool.organization_id
            AND NOT is_in_service_status(tool.status)
	  RETURNING *;
  END;
$$
LANGUAGE plpgsql;
