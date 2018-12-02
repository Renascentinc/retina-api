BEGIN;

CREATE TABLE IF NOT EXISTS public."location" (
	city							str_t 								NOT NULL,
	state 						state_t			 					NOT NULL,
	zip 							zip_t 								NOT NULL,
	address_line_one	long_str_t 						NOT NULL,
  organization_id   id_t                  NOT NULL,
  "name" 						str_t                 NOT NULL,
	address_line_two 	long_str_t,

  PRIMARY KEY (id, organization_id),
  CONSTRAINT session_unique_city_state_zip_address_line_one UNIQUE (city, state, zip, address_line_one, "name", organization_id)
) INHERITS (tool_owner);

CREATE UNIQUE INDEX IF NOT EXISTS location_id_index ON public.location (id);

COMMIT;
