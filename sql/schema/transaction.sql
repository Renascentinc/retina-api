BEGIN;

CREATE TABLE IF NOT EXISTS public."transaction" (
	id 								serial 	 					PRIMARY KEY,
	date 							date 							NOT NULL,
	"type" 						transaction_type 	NOT NULL,
	to_user_id 				id_t,
	from_user_id 			id_t,
	to_location_id 		id_t,
	from_location_id 	id_t,
	organization_id 	id_t
);

COMMIT;
