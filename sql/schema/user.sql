BEGIN;

CREATE TABLE IF NOT EXISTS public."user" (
	id integer primary key,
	first_name character varying(80),
	last_name character varying(80)
);

COMMIT;
