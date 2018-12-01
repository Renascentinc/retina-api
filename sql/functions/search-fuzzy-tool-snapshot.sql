
/*
 * Fuzzy search on all tool snapshots in an organization
 */
CREATE FUNCTION retina.search_fuzzy_tool_snapshot(
  organization_id id_t,
	lexemes		      text[],
  page_size       integer = NULL,
  page_number     integer = 0
)
 RETURNS SETOF tool_snapshot
AS $$
  BEGIN
  	RETURN QUERY
      SELECT * FROM retina.search_fuzzy_ids_tool_snapshot(
        lexemes := lexemes,
        tool_snapshot_ids := ARRAY(
          SELECT id FROM tool_snapshot
            WHERE tool_snapshot.organization_id = search_fuzzy_tool_snapshot.organization_id
        ),
        page_size := page_size,
        page_number := page_number
      );
  END;
$$
LANGUAGE plpgsql;
