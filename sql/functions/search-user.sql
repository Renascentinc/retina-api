-- TODO: Describe how this works
CREATE OR REPLACE FUNCTION public.search_user(
	lexemes		     text[],
	organization_id integer
)
 RETURNS SETOF public.user
AS $$
  DECLARE
    lexeme text;
  BEGIN
  	CREATE TEMP TABLE summed_scores ON COMMIT DROP AS
      SELECT id, 0.0 AS score FROM public.user WHERE public.user.organization_id = search_user.organization_id;

    FOREACH lexeme IN ARRAY lexemes LOOP
    	WITH scores as (
    		WITH sim_scores AS (
    			SELECT public.user.id as user_id,
        		GREATEST (
              similarity(public.user.first_name,lexeme),
              similarity(public.user.last_name,lexeme)
          	) as greatest_score
	        FROM public.user
	          WHERE public.user.id IN (SELECT id from summed_scores)
        )
    		SELECT * FROM sim_scores where sim_scores.greatest_score > 0.3
      ), _ AS (
      	DELETE FROM summed_scores where id not in (select user_id from scores)
      )
      UPDATE summed_scores AS ss SET score = ss.score + greatest_score FROM scores WHERE ss.id = scores.user_id;
    END LOOP;

    RETURN
      QUERY
        SELECT public.user.* FROM public.user
        JOIN (SELECT * FROM summed_scores
              ORDER BY score DESC
              LIMIT 25) ss
        ON public.user.id = ss.id
        ORDER BY ss.score DESC;
  END;
$$
LANGUAGE plpgsql;
