BEGIN;

CREATE TABLE IF NOT EXISTS public."user" (
	id bigint DEFAULT nextval('user_sampleid_seq'::regclass) NOT NULL,
	first_name character varying(80),
	last_name character varying(80),
	PRIMARY KEY(id)
);

COMMIT;
