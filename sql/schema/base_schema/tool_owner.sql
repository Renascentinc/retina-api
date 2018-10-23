BEGIN;

CREATE TABLE IF NOT EXISTS public.tool_owner (
	id 			             serial,
  organization_id      id_t       NOT NULL,
	type                 owner_type,-- NOT NULL,
  PRIMARY KEY (id, organization_id)
);

COMMIT;
