BEGIN;

CREATE TABLE IF NOT EXISTS public.configurable_item (
	id serial PRIMARY KEY NOT NULL,
	"type" configurable_item_type NOT NULL,
	"name" character varying(80) NOT NULL,
	sanctioned boolean NOT NULL,
	organization_id integer NOT NULL
);

COMMIT;
