BEGIN;

CREATE TABLE IF NOT EXISTS public.organization (
	id 			serial 			PRIMARY KEY,
	"name" 	long_str_t 	NOT NULL
);

COMMIT;
