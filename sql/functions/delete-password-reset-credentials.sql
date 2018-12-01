
CREATE OR REPLACE FUNCTION retina.delete_password_reset_credentials(
	user_id         id_t,
  organization_id id_t
)
RETURNS SETOF password_reset_credentials
AS $$
  BEGIN
    RETURN QUERY
		  DELETE FROM public.password_reset_credentials
		    WHERE password_reset_credentials.user_id = delete_password_reset_credentials.user_id
        AND password_reset_credentials.organization_id = delete_password_reset_credentials.organization_id
      RETURNING *;
  END;
$$
LANGUAGE plpgsql;
