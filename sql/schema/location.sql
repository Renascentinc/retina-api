BEGIN;

CREATE TABLE IF NOT EXISTS public."location" (
	id 								serial 								PRIMARY KEY,
	city							str_t 								NOT NULL,
	state 						state_t			 					NOT NULL,
	zip 							zip_t 								NOT NULL,
	organization_id 	id_t	 								NOT NULL,
	address_line_one	long_str_t 						NOT NULL,
	address_line_two 	long_str_t,
	"name" 						str_t
);

COMMIT;
