CREATE OR REPLACE FUNCTION public.transfer_tool (
	tool_id_list    integer[],
	to_owner_id 	  id_t,
  organization_id id_t
)
RETURNS SETOF public.tool
AS $$
  DECLARE
    tool_id id_t;
  BEGIN
    FOREACH tool_id IN ARRAY tool_id_list LOOP
      UPDATE public.tool
        SET
          owner_id = to_owner_id,
          status =
            CASE
              WHEN (SELECT status FROM tool WHERE tool.id = tool_id) = 'AVAILABLE'::tool_status AND
                   (SELECT type FROM tool_owner WHERE tool_owner.id = to_owner_id) = 'USER'::tool_owner_type
              THEN 'IN_USE'::tool_status

              WHEN (SELECT status FROM tool WHERE tool.id = tool_id) = 'IN_USE'::tool_status AND
                   (SELECT type FROM tool_owner WHERE tool_owner.id = to_owner_id) = 'LOCATION'::tool_owner_type
              THEN 'AVAILABLE'::tool_status

              ELSE status
            END
        WHERE public.tool.id = tool_id
          AND public.tool.organization_id = transfer_tool.organization_id;
    END LOOP;

    RETURN QUERY SELECT * FROM tool
      WHERE tool.id in (SELECT * from unnest(tool_id_list))
        AND tool.organization_id = transfer_tool.organization_id;
  END;
$$
LANGUAGE plpgsql;
