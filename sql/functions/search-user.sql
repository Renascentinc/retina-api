/*
 * 1) Create a table called summed_scores of all the organization's user ids, with scores of 0.
 * 2) For each search token
 *    1) For each user in summed_scores, find the score of the closest matching user column to the token
 *    2) Select only those users with a greatest similarity of > 0.3
 *    3) Delete users from summed_scores that were not selected in the previous step
 *    4) Add the greatest similarity for each user to the similarity column in summed_scores
 * 3) Join the resulting ids in summed_scores with the user table, selecting only the top 25 results (or the requested page of results, once paging is implemented)
 */
CREATE OR REPLACE FUNCTION public.search_user(
	lexemes		      text[],
	organization_id integer,
  page_size       integer = NULL,
  page_number     integer = 0
)
 RETURNS SETOF public.user
AS $$
  DECLARE
    lexeme text;
  BEGIN
  	CREATE TEMP TABLE summed_scores ON COMMIT DROP AS
      SELECT id, 0.0 AS score FROM public.user
        WHERE public.user.organization_id = search_user.organization_id
          AND public.user.status = 'ACTIVE'::user_status;

    FOREACH lexeme IN ARRAY lexemes LOOP
    	WITH scores as (
    		WITH greatest_scores AS (
    			SELECT public.user.id as user_id,
        		GREATEST (
              similarity(public.user.first_name,lexeme),
              similarity(public.user.last_name,lexeme)
          	) as greatest_score
	        FROM public.user
	          WHERE public.user.id IN (SELECT id from summed_scores)
        )
    		SELECT * FROM greatest_scores where greatest_scores.greatest_score > 0.3
      ), _ AS (
      	DELETE FROM summed_scores where id not in (select user_id from scores)
      )
      UPDATE summed_scores AS ss SET score = ss.score + greatest_score FROM scores WHERE ss.id = scores.user_id;
    END LOOP;

    RETURN
      QUERY
        SELECT * FROM (
          SELECT public.user.* FROM public.user
            JOIN summed_scores
            ON public.user.id = summed_scores.id
          ORDER BY summed_scores.score DESC
        ) _
        OFFSET page_number*page_size
        LIMIT page_size;
  END;
$$
LANGUAGE plpgsql;
