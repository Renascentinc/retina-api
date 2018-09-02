
CREATE FUNCTION public.get_all_tool (
  organization_id id_t
) RETURNS SETOF public.tool
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM public.tool
    	WHERE public.tool.organization_id = get_all_tool.organization_id;
  END;
$$
LANGUAGE plpgsql;
