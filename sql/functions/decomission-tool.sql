
CREATE OR REPLACE FUNCTION public.decomission_tool(
  organization_id      id_t,
	tool_id              id_t,
  decomissioned_status decomissioned_tool_status
)
RETURNS SETOF public.tool
AS $$
  BEGIN
    RETURN QUERY
  		UPDATE tool
        SET status = decomission_tool.decomissioned_status::text::tool_status
          WHERE tool.id = decomission_tool.tool_id
            AND tool.organization_id = decomission_tool.organization_id
	  RETURNING *;
  END;
$$
LANGUAGE plpgsql;
