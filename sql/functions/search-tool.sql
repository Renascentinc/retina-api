
/**
 * 1) Find the similarity between the query and each column
 * 2) Find the greatest value for each row
 * 3) Order by that value
 */
CREATE FUNCTION public.search_tool(
	query            long_str_t,
  organization_id  id_t
)
 RETURNS SETOF public.tool
AS $$
  BEGIN
    RETURN QUERY
      SELECT tool.* FROM tool JOIN
        (
          SELECT tool_id,
            GREATEST (
              similarity(tool_id, search_tool.query),
              similarity(user_first_name, search_tool.query),
              similarity(user_last_name, search_tool.query),
              similarity(brand_name, search_tool.query),
              similarity(type_name, search_tool.query),
              similarity(tool_model_number, search_tool.query),
              similarity(tool_serial_number, search_tool.query),
              similarity(location_name, search_tool.query),
              similarity(tool_status, search_tool.query)
            ) as greatest_score
          FROM tool_search_item_view
            WHERE tool_organization_id = search_tool.organization_id
          ORDER BY greatest_score DESC
          LIMIT 100
        ) ordered_tools
      ON tool.id = ordered_tools.tool_id::integer
      ORDER BY ordered_tools.greatest_score;
  END;
$$
LANGUAGE plpgsql;
