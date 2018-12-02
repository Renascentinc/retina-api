BEGIN;

CREATE TABLE IF NOT EXISTS public.organization (
	id 			serial 			PRIMARY KEY,
	"name" 	citext 	    NOT NULL UNIQUE
);

CREATE UNIQUE INDEX IF NOT EXISTS organization_id_index ON public.organization (id);

COMMIT;
