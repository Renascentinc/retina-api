
/*
 * Pass lexems and the results from search_strict_tool to search_fuzzy_ids_tool
 */
CREATE OR REPLACE FUNCTION retina.search_strict_fuzzy_tool_snapshot (
  organization_id id_t,
	lexemes		           text[],
  only_latest_snapshot boolean       = false,
  tool_ids             integer[]     = NULL,

  -------- Tool Search Params --------
  owner_ids       integer[]     = NULL,
  brand_ids       integer[]     = NULL,
  type_ids        integer[]     = NULL,
  tool_statuses   tool_status[] = NULL,

  -------- Metadata Search Params --------
  tool_actions    tool_action[] = NULL,
  start_time      timestamp     = NULL,
  end_time        timestamp     = NULL,

  page_size       integer       = NULL,
  page_number     integer       = 0
)
RETURNS SETOF public.tool_snapshot
AS $$
  BEGIN
    IF array_length(lexemes, 1) = 0 THEN
      RETURN QUERY
        SELECT * FROM retina.search_strict_tool_snapshot (
          organization_id := organization_id,
          tool_ids := tool_ids,
          owner_ids := owner_ids,
          brand_ids := brand_ids,
          type_ids := type_ids,
          tool_statuses := tool_statuses,
          tool_actions := tool_actions,
          start_time := start_time,
          end_time := end_time,
          page_size := page_size,
          page_number := page_number,
          only_latest_snapshot := only_latest_snapshot
        );
    END IF;

    RETURN QUERY SELECT * FROM retina.search_fuzzy_ids_tool_snapshot (
      lexemes,
      ARRAY (
        SELECT id FROM retina.search_strict_tool_snapshot (
          organization_id := organization_id,
          tool_ids := tool_ids,
          owner_ids := owner_ids,
          brand_ids := brand_ids,
          type_ids := type_ids,
          tool_statuses := tool_statuses,
          tool_actions := tool_actions,
          start_time := start_time,
          end_time := end_time,
          page_size := page_size,
          page_number := page_number,
          only_latest_snapshot := only_latest_snapshot
        )
      ),
      page_size := page_size,
      page_number := page_number
    );
  END;
$$
LANGUAGE plpgsql;
