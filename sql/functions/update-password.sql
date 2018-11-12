
CREATE OR REPLACE FUNCTION public.update_password (
	user_id          id_t,
	current_password long_str_t,
  new_password     long_str_t,
  organization_id  id_t
)
RETURNS SETOF public.user
AS $$
  BEGIN
    RETURN QUERY
    UPDATE public.user
    	SET
    		password = crypt(update_password.new_password, gen_salt('bf'))
    	WHERE public.user.id = update_password.user_id
        AND public.user.organization_id = update_password.organization_id
        AND public.user.password = crypt(update_password.current_password, public.user.password)
        AND public.user.status = 'ACTIVE'::user_status
    RETURNING *;
  END;
$$
LANGUAGE plpgsql;
