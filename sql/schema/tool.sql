BEGIN;

CREATE TABLE public.tool (
	id 						 serial primary key,
	class 				 character varying(80),
	type 					 character varying(80),
	brand 				 character varying(80),
	date_purchased date,
	purchased_from character varying(80),
	price	  	     integer,
	model_number   character varying(80),
	status				 character varying(80),
	photo					 character varying(200) -- Will we want to have the whole url in here?
);

COMMIT;
