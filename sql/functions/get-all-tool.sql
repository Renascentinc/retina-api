
CREATE FUNCTION public.get_all_tool (
  organization_id id_t,
  page_size       integer = NULL,
  page_number     integer = 0
) RETURNS SETOF public.tool
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM public.tool
    	WHERE public.tool.organization_id = get_all_tool.organization_id
      ORDER BY tool.id
      OFFSET page_number*page_size
      LIMIT page_size;
  END;
$$
LANGUAGE plpgsql;
