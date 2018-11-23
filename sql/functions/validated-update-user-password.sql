
CREATE OR REPLACE FUNCTION public.validated_update_user_password (
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
    		password = crypt(validated_update_user_password.new_password, gen_salt('bf'))
    	WHERE public.user.id = validated_update_user_password.user_id
        AND public.user.organization_id = validated_update_user_password.organization_id
        AND public.user.password = crypt(validated_update_user_password.current_password, public.user.password)
        AND public.user.status = 'ACTIVE'::user_status
    RETURNING *;
  END;
$$
LANGUAGE plpgsql;
