BEGIN;

CREATE TABLE IF NOT EXISTS public.session (
	token 	        uuid_t NOT NULL UNIQUE,
	user_id         id_t   NOT NULL,
  organization_id id_t   NOT NULL
);

COMMIT;
