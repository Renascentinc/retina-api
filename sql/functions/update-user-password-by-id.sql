

CREATE OR REPLACE FUNCTION public.update_user_password_by_id (
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
    		password = crypt(update_user_password_by_id.new_password, gen_salt('bf'))
    	WHERE public.user.id = update_user_password_by_id.user_id
        AND public.user.organization_id = update_user_password_by_id.organization_id
    RETURNING *;
  END;
$$
LANGUAGE plpgsql;
