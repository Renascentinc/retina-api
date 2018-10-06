
CREATE OR REPLACE FUNCTION public.get_user_by_email (
  email           str_t
)
RETURNS SETOF public.user
AS $$
  DECLARE
    organization_id id_t;
  BEGIN
    RETURN QUERY
      SELECT * FROM public.user
		    WHERE public.user.email = get_user_by_email.email;
  END;
$$
LANGUAGE plpgsql;
