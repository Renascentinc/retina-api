BEGIN;

CREATE TABLE IF NOT EXISTS public.organization (
	id 			serial 			PRIMARY KEY,
	"name" 	citext 	    NOT NULL UNIQUE
);

CREATE UNIQUE INDEX ON public.organization (id);

COMMIT;
