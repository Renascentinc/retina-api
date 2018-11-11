BEGIN;

CREATE TABLE IF NOT EXISTS public.user (
	first_name			str_t						 NOT NULL,
	last_name				str_t						 NOT NULL,
	email						citext					 NOT NULL,
	phone_number		short_str_t			 NOT NULL,
	password				str_t						 NOT NULL,
	role				 		role				     NOT NULL,
	status			 		user_status      NOT NULL,
  organization_id id_t             NOT NULL,
  PRIMARY KEY (id, organization_id),
  CONSTRAINT user_unique_email UNIQUE (email, organization_id)
) INHERITS (tool_owner);

CREATE UNIQUE INDEX ON public.user (id);

/**
 * Because table public.user is an inherited table, its columns cannot be used
 * as foreign keys. In order to get around this problem, this table, public.user_id
 * mirrors the ids in public.user via trigger user_created. This way, any table
 * that uses public.user can make a constraint on a user's id by referencing public.user_id.
 *
 * @see TRIGGER user_created
 */
CREATE TABLE IF NOT EXISTS public.user_id (
  id 			             SERIAL,
  organization_id      id_t            NOT NULL,
  PRIMARY KEY (id, organization_id)
);

COMMIT;
