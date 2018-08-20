BEGIN;

CREATE TABLE IF NOT EXISTS public."location" (
	id serial PRIMARY KEY NOT NULL,
	"name" character varying(80),
	address_line_one character varying(200) NOT NULL,
	address_line_two character varying(200),
	city character varying(80) NOT NULL,
	state character varying(2) NOT NULL,
	zip integer NOT NULL,
	organization_id integer NOT NULL
);

COMMIT;
