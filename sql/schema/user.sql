BEGIN;

CREATE TABLE public.user (
	id   				 serial PRIMARY KEY NOT NULL,
	name 				 character varying(80),
	password 		 character varying(80),
	role 				 character varying(80),
	phone_number character varying(80),
	email 			 character varying(80),
	status 			 character varying(80)
);

COMMIT;
