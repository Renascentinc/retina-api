
CREATE OR REPLACE FUNCTION retina.get_user_by_email (
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
        AND public.user.status = 'ACTIVE'::user_status;
  END;
$$
LANGUAGE plpgsql;
