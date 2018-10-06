
/*
 * Pass lexems and the results from search_strict_tool to search_fuzzy_ids_tool
 */
CREATE OR REPLACE FUNCTION public.search_strict_fuzzy_tool (
  organization_id id_t,
  lexemes		      text[],
  user_id         id_t             = NULL,
  brand_id        id_t             = NULL,
  type_id         id_t             = NULL,
  tool_status     tool_status_type = NULL,
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
          user_id := user_id,
          brand_id := brand_id,
          type_id := type_id,
          tool_status := tool_status,
          page_size := page_size,
          page_number := page_number
        );
    END IF;

    RETURN QUERY SELECT * FROM search_fuzzy_ids_tool (
      lexemes,
      ARRAY (
        SELECT id FROM search_strict_tool (
          organization_id := organization_id,
          user_id := user_id,
          brand_id := brand_id,
          type_id := type_id,
          tool_status := tool_status
        )
      ),
      page_size := page_size,
      page_number := page_number
    );
  END;
$$
LANGUAGE plpgsql;
