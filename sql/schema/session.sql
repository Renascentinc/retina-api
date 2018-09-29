BEGIN;

CREATE TABLE IF NOT EXISTS public.session (
	token 	        uuid_t NOT NULL,
	user_id         id_t   NOT NULL UNIQUE,
  organization_id id_t   NOT NULL
);

CREATE UNIQUE INDEX ON public.session (token);

COMMIT;
