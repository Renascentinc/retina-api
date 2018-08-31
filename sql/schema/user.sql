BEGIN;

-- TODO: Find out what is stored in AD

-- TODO: Make sure that email is unique within an org because that is the login credential?
CREATE TABLE IF NOT EXISTS public.user (
	id   				 		serial 					 PRIMARY KEY,
	role				 		role_type				 NOT NULL,
	status			 		user_status_type NOT NULL,
	organization_id id_t
);

COMMIT;
