
/*
 * Dynamic query creation pulled from https://stackoverflow.com/questions/30212336/select-from-table-where-column-anything
 *
 * Create a base query assuming all tools will be selected from an organization. Then append filters to
 * the base query based on what filter values aren't null. Select the result ids into an array and pass the
 * array and lexemes into search_fuzzy_ids_tool 
 *
 * I'm assuming SQL injection won't be a problem here because only integers and enums are being passed in.
 */
 CREATE OR REPLACE FUNCTION public.search_strict_fuzzy_tool (
   organization_id id_t,
   lexemes		    text[],
   user_id         id_t             = NULL,
   brand_id        id_t             = NULL,
   type_id         id_t             = NULL,
   tool_status     tool_status_type = NULL
 )
 RETURNS SETOF public.tool
 AS $$
   DECLARE
     tool_id_query text = 'SELECT id FROM public.tool WHERE organization_id = ' || search_strict_fuzzy_tool.organization_id;
     tool_ids integer[];
   BEGIN

     tool_id_query = tool_id_query ||
       (CASE WHEN search_strict_fuzzy_tool.user_id IS NULL THEN '' ELSE ' AND user_id =' || search_strict_fuzzy_tool.user_id END) ||
       (CASE WHEN search_strict_fuzzy_tool.brand_id IS NULL THEN '' ELSE ' AND brand_id =' || search_strict_fuzzy_tool.brand_id END) ||
       (CASE WHEN search_strict_fuzzy_tool.type_id IS NULL THEN '' ELSE ' AND type_id =' || search_strict_fuzzy_tool.type_id END) ||
       (CASE WHEN search_strict_fuzzy_tool.tool_status IS NULL THEN '' ELSE ' AND status =' || quote_literal(search_strict_fuzzy_tool.tool_status) END);

     EXECUTE 'SELECT ARRAY(' || tool_id_query || ')' into tool_ids;

     RETURN QUERY SELECT * FROM search_fuzzy_ids_tool(lexemes, tool_ids);

   END;
 $$
 LANGUAGE plpgsql;
