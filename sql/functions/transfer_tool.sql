CREATE OR REPLACE FUNCTION public.transfer_tool(
	tool_id_list integer[],
	to_user_id 	 id_t
)
RETURNS SETOF public.tool
AS $$
  BEGIN

  END;
$$
LANGUAGE plpgsql;
