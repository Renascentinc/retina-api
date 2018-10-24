BEGIN;

CREATE TABLE IF NOT EXISTS public.tool_owner (
	id 			             SERIAL,
  organization_id      id_t            NOT NULL,
	type                 tool_owner_type NOT NULL,
  PRIMARY KEY (id, organization_id)
);

/**
 * Because table public.tool_owner is a parent table, its columns cannot be used
 * as foreign keys. In order to get around this problem, this table, public.tool_owner_id,
 * mirrors the ids in public.tool_owner via triggers user_created and location_created.
 * This way, any table that uses public.tool_owner can make a constraint on an owner's id
 * by referencing public.tool_owner_id.
 *
 * @see TRIGGER user_created
 * @see TRIGGER location_created
 */
CREATE TABLE IF NOT EXISTS public.tool_owner_id (
	id 			             SERIAL,
  organization_id      id_t            NOT NULL,
  PRIMARY KEY (id, organization_id)
);

COMMIT;
