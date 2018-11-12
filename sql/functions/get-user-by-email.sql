
CREATE OR REPLACE FUNCTION public.get_user_by_email (
  email           citext
)
RETURNS SETOF public.user
AS $$
  DECLARE
    organization_id id_t;
  BEGIN
    RETURN QUERY
      SELECT * FROM public.user
		    WHERE public.user.email = get_user_by_email.email
        AND is_user_active(public.user.id);
  END;
$$
LANGUAGE plpgsql;
