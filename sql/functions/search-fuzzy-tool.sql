
/*
 * Fuzzy search on all tools in an organization
 */
CREATE FUNCTION public.search_fuzzy_tool(
  organization_id id_t,
	lexemes		      text[],
  page_size       integer = NULL,
  page_number     integer = 0
)
 RETURNS SETOF tool
AS $$
  BEGIN
  	RETURN QUERY
      SELECT * FROM search_fuzzy_ids_tool(
        lexemes := lexemes,
        tool_ids := ARRAY(
          SELECT id FROM tool
            WHERE tool.organization_id = search_fuzzy_tool.organization_id
              AND is_in_service_status(tool.status)
        ),
        page_size := page_size,
        page_number := page_number
      );
  END;
$$
LANGUAGE plpgsql;
