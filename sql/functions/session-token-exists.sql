CREATE OR REPLACE FUNCTION public.session_token_exists (
  token           long_str_t
)
RETURNS boolean
AS $$
  BEGIN
    RETURN EXISTS (
      SELECT 1 FROM public.session
		    WHERE public.session.token = session_token_exists.token
    );
  END;
$$
LANGUAGE plpgsql;
