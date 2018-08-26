BEGIN;

CREATE TABLE IF NOT EXISTS public.tool (
	id 								serial 			PRIMARY KEY,
	type_id 					id_t 				NOT NULL,
	brand_id 					id_t 				NOT NULL,
	model_number 			str_t 			NOT NULL,
	status 						status_type NOT NULL,
	organization_id 	id_t 				NOT NULL,
	serial_number 		str_t			 	NOT NULL,
	date_purchased 		date,
	purchased_from_id id_t,
	price 						integer,
	photo 						long_str_t,
	"year" 						integer,
	user_id 					id_t,
	location_id	 			id_t
);

COMMIT;
