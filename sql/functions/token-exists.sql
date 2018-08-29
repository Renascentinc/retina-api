CREATE OR REPLACE FUNCTION public.token_exists (
  token           long_str_t,
	user_id         id_t,
  organization_id id_t
)
RETURNS boolean
AS $$
  BEGIN
    RETURN EXISTS (
      SELECT 1 FROM public.token
		    WHERE public.token.token = token_exists.token
        AND public.token.user_id = token_exists.user_id
        AND public.token.organization_id = token_exists.organization_id
    );
  END;
$$
LANGUAGE plpgsql;
