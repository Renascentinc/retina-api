CREATE OR REPLACE FUNCTION public.update_user (
  id              id_t,
  role            role_type,
	status          user_status_type,
  organization_id id_t
)
RETURNS SETOF public.user
AS $$
  BEGIN
    RETURN QUERY
    UPDATE public.user
    	SET
    		role   = update_user.role,
        status = update_user.status
    	WHERE public.user.id = update_user.id
       AND public.user.organization_id = update_user.organization_id
    RETURNING *;
  END;
$$
LANGUAGE plpgsql;
