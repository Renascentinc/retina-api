CREATE OR REPLACE FUNCTION public.get_session_by_token (
  token           uuid_t
)
RETURNS SETOF public.session
AS $$
  BEGIN
    RETURN QUERY
      SELECT * FROM public.session
		    WHERE public.session.token = get_session_by_token.token
        AND is_user_active(public.session.user_id);
  END;
$$
LANGUAGE plpgsql;
