

CREATE FUNCTION public.get_tool(
	id               id_t,
  organization_id  id_t
)
 RETURNS SETOF public.tool
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM public.tool
    	WHERE public.tool.id = get_tool.id
      AND public.tool.organization_id = get_tool.organization_id;
  END;
$$
LANGUAGE plpgsql;
