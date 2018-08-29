CREATE OR REPLACE FUNCTION public.delete_token(
  token           long_str_t,
	user_id         id_t,
  organization_id id_t
)
RETURNS SETOF public.token
AS $$
  BEGIN
    RETURN QUERY
		DELETE FROM public.token
		WHERE public.token.token = delete_token.token
      AND public.token.user_id = delete_token.user_id
      AND public.token.organization_id = delete_token.organization_id
	RETURNING *;
  END;
$$
LANGUAGE plpgsql;
