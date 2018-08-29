BEGIN;

CREATE TABLE IF NOT EXISTS public.token (
	token 	        long_str_t,
	user_id         id_t,
  organization_id id_t
);

COMMIT;
