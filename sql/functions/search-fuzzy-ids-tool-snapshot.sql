
/*
 * 1) Create a table called summed_scores of all passed in tool snaphot ids, with scores of 0.
 * 2) For each search lexeme
 *    1) For each tool snapshot in summed_scores, find the score of the closest matching column from tool_snapshot_search_view to the lexeme
 *    2) Select only those tool snapshots with a greatest similarity of > 0.3
 *    3) Delete snapshots from summed_scores that were not selected in the previous step
 *    4) Add the greatest similarity for each snapshots to the similarity column in summed_scores
 * 3) Join the resulting ids in summed_scores with the snapshots table, selecting only the top 25 results (or the requested page of results, once paging is implemented)
 */
 CREATE FUNCTION public.search_fuzzy_ids_tool_snapshot(
   lexemes		       text[],
   tool_snapshot_ids integer[],
   page_size         integer = NULL,
   page_number       integer = 0
 )
  RETURNS SETOF tool_snapshot
 AS $$
  DECLARE
    lexeme text;
  BEGIN
    CREATE TEMP TABLE summed_scores ON COMMIT DROP AS
      SELECT id, 0.0 AS score FROM unnest(tool_snapshot_ids) as id;

    FOREACH lexeme IN ARRAY lexemes LOOP
      WITH scores as (
     	  WITH greatest_scores AS (
     		  SELECT tool_snapshot_id::integer as tool_snapshot_id,
         	  GREATEST (
             	 similarity(tool_snapshot_search_view.tool_id,lexeme),
               similarity(user_first_name,lexeme),
               similarity(user_last_name,lexeme),
               similarity(brand_name,lexeme),
               similarity(type_name,lexeme),
               similarity(tool_model_number,lexeme),
               similarity(tool_serial_number,lexeme),
               similarity(location_name,lexeme),
               similarity(tool_status,lexeme),
               similarity(tool_action,lexeme)
           	) as greatest_score
 	        FROM tool_snapshot_search_view
 	          WHERE tool_snapshot_id::integer IN (SELECT id FROM summed_scores)
        )
     		SELECT * FROM greatest_scores WHERE greatest_scores.greatest_score > 0.3
      ), _ AS (
        DELETE FROM summed_scores WHERE id NOT IN (SELECT tool_snapshot_id FROM scores)
      )
      UPDATE summed_scores AS ss
        SET score = ss.score + greatest_score
      FROM scores
        WHERE ss.id = scores.tool_snapshot_id;
    END LOOP;

     RETURN
       QUERY
         SELECT * FROM (
           SELECT tool_snapshot.* FROM tool_snapshot
             JOIN summed_scores
             ON tool_snapshot.id = summed_scores.id
           ORDER BY tool_snapshot.timestamp DESC
         ) _
         OFFSET page_number*page_size
         LIMIT page_size;
   END;
 $$
 LANGUAGE plpgsql;
