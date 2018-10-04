
/*
 * Fuzzy search on all tools in an organization
 */
CREATE FUNCTION public.search_fuzzy_tool(
	lexemes		      text[],
	organization_id id_t
)
 RETURNS SETOF tool
AS $$
  BEGIN
  	RETURN QUERY
      SELECT * FROM search_fuzzy_ids_tool(lexemes, ARRAY(SELECT id FROM tool WHERE tool.organization_id = search_fuzzy_tool.organization_id));
  END;
$$
LANGUAGE plpgsql;
