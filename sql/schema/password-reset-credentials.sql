
BEGIN;

CREATE TABLE IF NOT EXISTS public.password_reset_credentials (
	organization_id 	  id_t,
  user_id             id_t,
	code                uuid_t,
  expiration_date     timestamp,
  CONSTRAINT unique_password_reset_credentials UNIQUE  (user_id, organization_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS password_reset_credentials_id_index ON public.password_reset_credentials (code);

COMMIT;
