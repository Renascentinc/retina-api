BEGIN;

-- TODO: Find out what is stored in AD

-- TODO: Make sure that email is unique within an org because that is the login credential?
CREATE TABLE IF NOT EXISTS public.user (
	id   				 		serial 					 PRIMARY KEY,
	first_name			str_t						 NOT NULL,
	last_name				str_t						 NOT NULL,
	email						str_t						 NOT NULL,
	phone_number		short_str_t			 NOT NULL,
	password				str_t						 NOT NULL,
	role				 		role_type				 NOT NULL,
	status			 		user_status_type NOT NULL,
	organization_id id_t             NOT NULL
);

COMMIT;
