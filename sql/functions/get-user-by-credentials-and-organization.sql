
CREATE OR REPLACE FUNCTION public.get_user_by_credentials_and_organization (
  email           citext,
  password        str_t,
  organization_id id_t
)
RETURNS SETOF public.user
AS $$
  DECLARE
    organization_id id_t;
  BEGIN
    RETURN QUERY
      SELECT * FROM public.user
		    WHERE public.user.email = get_user_by_credentials_and_organization.email
        AND public.user.password = crypt(get_user_by_credentials_and_organization.password, public.user.password)
        AND public.user.organization_id = get_user_by_credentials_and_organization.organization_id
        AND public.user.status = 'ACTIVE'::user_status;
  END;
$$
LANGUAGE plpgsql;
