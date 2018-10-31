
CREATE OR REPLACE FUNCTION public.delete_password_reset_credentials(
	user_id         id_t,
  organization_id id_t
)
RETURNS VOID
AS $$
  BEGIN
		DELETE FROM public.password_reset_credentials
		WHERE password_reset_credentials.user_id = delete_password_reset_credentials.user_id
      AND password_reset_credentials.organization_id = delete_password_reset_credentials.organization_id;
  END;
$$
LANGUAGE plpgsql;
