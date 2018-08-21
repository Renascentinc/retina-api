BEGIN;

CREATE TABLE IF NOT EXISTS public.tool (
	id serial PRIMARY KEY NOT NULL,
	"class" character varying(80),
	"type" character varying(80) NOT NULL,
	brand character varying(80) NOT NULL,
	date_purchased date,
	purchased_from character varying(80),
	price integer,
	model_number character varying(80) NOT NULL,
	status character varying(80) NOT NULL,
	photo character varying(200),
	"year" integer,
	serial_number character varying(80) NOT NULL,
	user_id integer,
	organization_id integer NOT NULL,
	location_id integer
);

COMMIT;
