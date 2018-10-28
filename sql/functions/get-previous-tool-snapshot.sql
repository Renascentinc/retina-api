

CREATE FUNCTION public.get_previous_tool_snapshot(
	tool_id   id_t,
  "timestamp" timestamp
)
 RETURNS SETOF public.tool_snapshot
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM tool_snapshot
        WHERE tool_snapshot.tool_id = get_previous_tool_snapshot.tool_id
          AND tool_snapshot.timestamp < get_previous_tool_snapshot.timestamp
      ORDER BY
        tool_snapshot.timestamp DESC
        LIMIT 1;
  END;
$$
LANGUAGE plpgsql;
