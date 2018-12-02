
CREATE OR REPLACE FUNCTION retina.update_user_password (
	user_id          id_t,
  new_password     long_str_t,
  organization_id  id_t
)
RETURNS SETOF public.user
AS $$
  BEGIN
    RETURN QUERY
    UPDATE public.user
    	SET
    		password = crypt(update_user_password.new_password, gen_salt('bf'))
    	WHERE public.user.id = update_user_password.user_id
        AND public.user.organization_id = update_user_password.organization_id
        AND public.user.status = 'ACTIVE'::user_status
    RETURNING *;
  END;
$$
LANGUAGE plpgsql;
