BEGIN;

CREATE TABLE IF NOT EXISTS public.session (
	token 	        uuid_t NOT NULL,
	user_id         id_t   NOT NULL,
  organization_id id_t   NOT NULL,
  CONSTRAINT session_unique_token_user_id_organization_id UNIQUE (token, user_id, organization_id)
);

CREATE UNIQUE INDEX ON public.session (token);

COMMIT;
