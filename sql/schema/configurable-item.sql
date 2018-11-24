BEGIN;

CREATE TABLE IF NOT EXISTS public.configurable_item (
	id 							SERIAL,
	"type" 					configurable_item_type	NOT NULL,
	"name" 					citext    							NOT NULL,
	sanctioned 			boolean 								NOT NULL,
  deleted         boolean                 NOT NULL DEFAULT false,
	organization_id id_t 										NOT NULL,
  PRIMARY KEY (id, organization_id),
  CONSTRAINT configurable_item_unique_type_name UNIQUE (type, name, organization_id)
);

CREATE UNIQUE INDEX ON public.configurable_item (id);

COMMIT;
