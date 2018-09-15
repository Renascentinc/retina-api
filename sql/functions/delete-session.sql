CREATE OR REPLACE FUNCTION public.delete_session(
  token           long_str_t,
	user_id         id_t,
  organization_id id_t
)
RETURNS SETOF public.session
AS $$
  BEGIN
    RETURN QUERY
		DELETE FROM public.session
		WHERE public.session.token = delete_session.token
      AND public.session.user_id = delete_session.user_id
      AND public.session.organization_id = delete_session.organization_id
	RETURNING *;
  END;
$$
LANGUAGE plpgsql;
