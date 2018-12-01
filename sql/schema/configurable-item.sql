BEGIN;

CREATE TABLE IF NOT EXISTS public.configurable_item (
	id 							SERIAL,
	"type" 					configurable_item_type	NOT NULL,
	"name" 					citext    							NOT NULL,
	sanctioned 			boolean 								NOT NULL,
  deleted         boolean                 NOT NULL DEFAULT false,
	organization_id id_t 										NOT NULL,
  PRIMARY KEY (id, organization_id),
  CONSTRAINT configurable_item_unique UNIQUE (type, name, deleted, organization_id)
  -- Constraint for unique configurable item w/different deleted status is in triggers/configurable-item-insert-update.sql
);

CREATE UNIQUE INDEX ON public.configurable_item (id);

COMMIT;
