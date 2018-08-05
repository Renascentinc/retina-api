BEGIN;

CREATE TABLE IF NOT EXISTS public.tool (
	id bigint DEFAULT nextval('tool_sampleid_seq'::regclass) NOT NULL,
	type character varying(80),
	brand character varying(80),
	purchase_date date,
	PRIMARY KEY(id)
);

COMMIT;
