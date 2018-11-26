BEGIN;

CREATE TABLE IF NOT EXISTS public.configurable_item (
	id 							SERIAL,
	"type" 					configurable_item_type	NOT NULL,
	"name" 					citext    							NOT NULL,
	sanctioned 			boolean 								NOT NULL,
  deleted         boolean                 NOT NULL DEFAULT false,
	organization_id id_t 										NOT NULL,
  PRIMARY KEY (id, organization_id)
  -- Constraint for unique tool is in triggers/configurable-item-insert-update.sql
);

CREATE UNIQUE INDEX ON public.configurable_item (id);

COMMIT;
