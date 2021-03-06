CREATE OR REPLACE FUNCTION retina.update_user (
  id              id_t,
  first_name			str_t,
	last_name				str_t,
	email						str_t,
	phone_number		short_str_t,
	role				 		role,
	status			 		user_status,
	organization_id id_t
)
RETURNS SETOF public.user
AS $$
  BEGIN
    RETURN QUERY
    UPDATE public.user
    	SET
        first_name   = update_user.first_name,
        last_name    = update_user.last_name,
        email        = LOWER(update_user.email),
        phone_number = update_user.phone_number,
        role         = update_user.role,
        status       = update_user.status
    	WHERE public.user.id = update_user.id
       AND public.user.organization_id = update_user.organization_id
       AND public.user.status = 'ACTIVE'::user_status
    RETURNING *;
  END;
$$
LANGUAGE plpgsql;
