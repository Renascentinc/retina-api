BEGIN;

CREATE TABLE IF NOT EXISTS public.organization (
	id 			serial 			PRIMARY KEY,
	"name" 	long_str_t 	NOT NULL UNIQUE
);

CREATE UNIQUE INDEX ON public.organization (id);

COMMIT;
