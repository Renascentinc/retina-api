BEGIN;

CREATE TABLE IF NOT EXISTS public.tool (
	id integer primary key,
	type character varying(80),
	brand character varying(80),
	purchase_date date
);

COMMIT;
