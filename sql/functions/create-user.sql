CREATE OR REPLACE FUNCTION public.create_user (
  role            role_type,
	status          user_status_type,
  organization_id id_t
) RETURNS SETOF public.user
AS $$
  BEGIN
    RETURN QUERY
      INSERT INTO public.user (
        role,
        status,
        organization_id
      ) VALUES (
        role,
        status,
        organization_id
      ) RETURNING *;
  END;
$$
LANGUAGE plpgsql;
