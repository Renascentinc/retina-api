
CREATE FUNCTION public.get_tool_snapshot (
	tool_snapshot_id id_t,
  organization_id  id_t
)
 RETURNS SETOF tool_snapshot
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM tool_snapshot
    	WHERE tool_snapshot.id = get_tool_snapshot.tool_snapshot_id
      AND tool_snapshot.organization_id = get_tool_snapshot.organization_id;
  END;
$$
LANGUAGE plpgsql;
