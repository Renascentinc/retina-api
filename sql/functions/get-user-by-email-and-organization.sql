
CREATE OR REPLACE FUNCTION retina.get_user_by_email_and_organization (
  email           citext,
  organization_id id_t
)
RETURNS SETOF public.user
AS $$
  DECLARE
    organization_id id_t;
  BEGIN
    RETURN QUERY
      SELECT * FROM public.user
		    WHERE public.user.email = get_user_by_email_and_organization.email
        AND public.user.organization_id = get_user_by_email_and_organization.organization_id
        AND public.user.status = 'ACTIVE'::user_status;
  END;
$$
LANGUAGE plpgsql;
