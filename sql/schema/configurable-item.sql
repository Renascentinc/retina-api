BEGIN;

CREATE TABLE IF NOT EXISTS public.configurable_item (
	id 							serial 									PRIMARY KEY,
	"type" 					configurable_item_type	NOT NULL,
	"name" 					long_str_t 							NOT NULL,
	sanctioned 			boolean 								NOT NULL,
	organization_id id_t 										NOT NULL
);

COMMIT;
