
-- TODO: Describe how this works
CREATE FUNCTION public.search_tool(
	lexemes		     text[],
	organization_id integer
)
 RETURNS SETOF tool
AS $$
  DECLARE
    lexeme text;
  BEGIN
  	CREATE TEMP TABLE summed_scores ON COMMIT DROP AS
      SELECT id, 0.0 AS score FROM tool WHERE tool.organization_id = search_tool.organization_id;

    FOREACH lexeme IN ARRAY lexemes LOOP
    	WITH scores as (
        SELECT tool_search_item_view.tool_id::id_t as tool_id,
          GREATEST (
            similarity(tool_search_item_view.tool_id,lexeme),
            similarity(user_first_name,lexeme),
            similarity(user_last_name,lexeme),
            similarity(brand_name,lexeme),
            similarity(type_name,lexeme),
            similarity(tool_model_number,lexeme),
            similarity(tool_serial_number,lexeme),
            similarity(location_name,lexeme),
            similarity(tool_status,lexeme)
          ) as greatest_score
        FROM tool_search_item_view
          WHERE tool_organization_id = search_tool.organization_id
      )
    	UPDATE summed_scores AS ss SET score = ss.score + greatest_score FROM scores WHERE ss.id = scores.tool_id;
    END LOOP;

    RETURN
      QUERY
        SELECT tool.* FROM tool
        JOIN (SELECT * FROM summed_scores
                WHERE score/array_length(lexemes, 1) > 0.2
              ORDER BY score DESC
              LIMIT 25) ss
        ON tool.id = ss.id
        ORDER BY ss.score DESC;
  END;
$$
LANGUAGE plpgsql;
