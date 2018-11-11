
CREATE OR REPLACE FUNCTION public.get_user_by_credentials (
  email           citext,
  password        str_t
)
RETURNS SETOF public.user
AS $$
  DECLARE
    organization_id id_t;
  BEGIN
    RETURN QUERY
      SELECT * FROM public.user
		    WHERE public.user.email = get_user_by_credentials.email
        AND public.user.password = crypt(get_user_by_credentials.password, public.user.password);
  END;
$$
LANGUAGE plpgsql;
