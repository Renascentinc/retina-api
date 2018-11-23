
CREATE FUNCTION public.get_multiple_tool(
	tool_ids         integer[],
  organization_id  id_t
)
 RETURNS SETOF public.tool
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM public.tool
    	WHERE public.tool.id IN (SELECT id FROM unnest(get_multiple_tool.tool_ids) as id)
      AND public.tool.organization_id = get_multiple_tool.organization_id;
  END;
$$
LANGUAGE plpgsql;
