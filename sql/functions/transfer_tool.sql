CREATE OR REPLACE FUNCTION public.transfer_tool (
	tool_id_list integer[],
	to_user_id 	 id_t
)
RETURNS SETOF public.tool
AS $$
  BEGIN
    /* FOREACH tool_id IN ARRAY tool_id_list LOOP
      IF (SELECT status FROM tool WHERE tool.tool_id = tool_id) = 'AVAILABLE'::tool_status AND
         (SELECT user_id FROM user where user_id ) THEN

      END IF;
    END LOOP; */
  END;
$$
LANGUAGE plpgsql;
