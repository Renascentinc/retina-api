BEGIN;

CREATE TABLE IF NOT EXISTS public.configurable_item (
	id 							serial,
	"type" 					configurable_item_type	NOT NULL,
	"name" 					long_str_t 							NOT NULL,
	sanctioned 			boolean 								NOT NULL,
	organization_id id_t 										NOT NULL,
  PRIMARY KEY (id, organization_id),
  CONSTRAINT session_unique_type_name UNIQUE (type, name, organization_id)
);

CREATE UNIQUE INDEX ON public.configurable_item (id);

COMMIT;
