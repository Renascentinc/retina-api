CREATE OR REPLACE FUNCTION retina.delete_session(
  token           uuid_t
)
RETURNS SETOF public.session
AS $$
  BEGIN
    RETURN QUERY
		DELETE FROM public.session
		  WHERE public.session.token = delete_session.token
	  RETURNING *;
  END;
$$
LANGUAGE plpgsql;
