BEGIN;

CREATE TABLE IF NOT EXISTS public.organization (
	id serial PRIMARY KEY NOT NULL,
	"name" character varying(200) NOT NULL
);

COMMIT;
