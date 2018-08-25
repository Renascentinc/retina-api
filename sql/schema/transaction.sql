BEGIN;

CREATE TABLE IF NOT EXISTS public."transaction" (
	id serial PRIMARY KEY NOT NULL,
	date date NOT NULL,
	to_user_id integer,
	from_user_id integer,
	to_location_id integer,
	from_location_id integer,
	organization_id integer,
	"type" transaction_type NOT NULL
);

COMMIT;
