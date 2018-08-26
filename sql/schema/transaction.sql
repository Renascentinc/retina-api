BEGIN;

CREATE TABLE IF NOT EXISTS public."transaction" (
	id 								serial 						PRIMARY KEY,
	date 							date 							NOT NULL,
	"type" 						transaction_type 	NOT NULL,
	organization_id 	id_t 							NOT NULL,
	transaction_id 		uuid_t 						NOT NULL,
	tool_id 					id_t 							NOT NULL,
	to_status 				status_type,
	from_status 			status_type,
	to_user_id 				id_t,
	from_user_id 			id_t,
	to_location_id 		id_t,
	from_location_id 	id_t
);

COMMIT;
