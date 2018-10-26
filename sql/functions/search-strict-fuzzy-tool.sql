
/*
 * Pass lexems and the results from search_strict_tool to search_fuzzy_ids_tool
 */
CREATE OR REPLACE FUNCTION public.search_strict_fuzzy_tool (
  organization_id id_t,
  lexemes		      text[],
  owner_ids        integer[]             = NULL,
  brand_ids        integer[]             = NULL,
  type_ids         integer[]             = NULL,
  tool_statuses     tool_status[]      = NULL,
  page_size       integer          = NULL,
  page_number     integer          = 0
)
RETURNS SETOF public.tool
AS $$
  BEGIN
    IF array_length(lexemes, 1) = 0 THEN
      RETURN QUERY
        SELECT * FROM search_strict_tool (
          organization_id := organization_id,
          owner_ids := owner_ids,
          brand_ids := brand_ids,
          type_ids := type_ids,
          tool_statuses := tool_statuses,
          page_size := page_size,
          page_number := page_number
        );
    END IF;

    RETURN QUERY SELECT * FROM search_fuzzy_ids_tool (
      lexemes,
      ARRAY (
        SELECT id FROM search_strict_tool (
          organization_id := organization_id,
          owner_ids := owner_ids,
          brand_ids := brand_ids,
          type_ids := type_ids,
          tool_statuses := tool_statuses
        )
      ),
      page_size := page_size,
      page_number := page_number
    );
  END;
$$
LANGUAGE plpgsql;
