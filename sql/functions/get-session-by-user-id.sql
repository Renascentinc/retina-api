
CREATE OR REPLACE FUNCTION retina.get_session_by_user_id (
  user_id           id_t
)
RETURNS SETOF public.session
AS $$
  BEGIN
    RETURN QUERY
      SELECT * FROM public.session
		    WHERE public.session.user_id = get_session_by_user_id.user_id
        AND retina.is_user_active(public.session.user_id);
  END;
$$
LANGUAGE plpgsql;
