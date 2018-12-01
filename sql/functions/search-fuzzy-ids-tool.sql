
/*
 * 1) Create a table called summed_scores of all passed in tool ids, with scores of 0.
 * 2) For each search lexeme
 *    1) For each tool in summed_scores, find the score of the closest matching column from tool_search_view to the lexeme
 *    2) Select only those tools with a greatest similarity of > 0.3
 *    3) Delete tools from summed_scores that were not selected in the previous step
 *    4) Add the greatest similarity for each tool to the similarity column in summed_scores
 * 3) Join the resulting ids in summed_scores with the tool table, selecting only the top 25 results (or the requested page of results, once paging is implemented)
 */
 CREATE FUNCTION retina.search_fuzzy_ids_tool(
   lexemes		   text[],
   tool_ids      integer[],
   page_size     integer = NULL,
   page_number   integer = 0
 )
  RETURNS SETOF tool
 AS $$
   DECLARE
     lexeme text;
   BEGIN
   	CREATE TEMP TABLE summed_scores ON COMMIT DROP AS
       SELECT id, 0.0 AS score FROM unnest(tool_ids) as id;

     FOREACH lexeme IN ARRAY lexemes LOOP
     	WITH scores as (
     		WITH greatest_scores AS (
     			SELECT tool_search_view.tool_id::id_t as tool_id,
         		GREATEST (
             	 similarity(tool_search_view.tool_id,lexeme),
               similarity(user_first_name,lexeme),
               similarity(user_last_name,lexeme),
               similarity(brand_name,lexeme),
               similarity(type_name,lexeme),
               similarity(tool_model_number,lexeme),
               similarity(tool_serial_number,lexeme),
               similarity(location_name,lexeme),
               similarity(tool_status,lexeme)
           	) as greatest_score
 	        FROM tool_search_view
 	          WHERE tool_id::integer IN (SELECT id from summed_scores)
 	    	)
     		SELECT * FROM greatest_scores where greatest_scores.greatest_score > 0.3
       ), _ AS (
       	DELETE FROM summed_scores where id not in (select tool_id from scores)
       )
       UPDATE summed_scores AS ss SET score = ss.score + greatest_score FROM scores WHERE ss.id = scores.tool_id;
     END LOOP;

     RETURN
       QUERY
        SELECT * FROM (
          SELECT tool.* FROM tool
            JOIN summed_scores
            ON tool.id = summed_scores.id
          ORDER BY summed_scores.score DESC
        ) _
        OFFSET page_number*page_size
        LIMIT page_size;
   END;
 $$
 LANGUAGE plpgsql;
