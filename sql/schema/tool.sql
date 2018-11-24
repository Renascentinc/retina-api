BEGIN;

CREATE TABLE IF NOT EXISTS public.tool (
	id 								serial,
	type_id 					id_t 						 NOT NULL,
	brand_id 					id_t 						 NOT NULL,
	model_number 			str_t 					 NOT NULL,
	status 						tool_status      NOT NULL,
	organization_id 	id_t 						 NOT NULL,
	serial_number 		str_t			 			 NOT NULL,
  owner_id          id_t             NOT NULL,
  owner_type        tool_owner_type  NOT NULL,
	date_purchased 		timestamp,
	purchased_from_id id_t,
	price 						integer,
	photo 						long_str_t,
	"year" 						integer,
  PRIMARY KEY (id, organization_id),
  CONSTRAINT tool_unique_not_decomissioned EXCLUDE (serial_number WITH =, model_number WITH =, brand_id WITH =) WHERE (is_in_service_status(status)),
  CONSTRAINT tool_unique_decomissioned EXCLUDE (serial_number WITH =, model_number WITH =, brand_id WITH =) WHERE (NOT is_in_service_status(status)),
  --CONSTRAINT tool_unique_serial_number UNIQUE (serial_number, organization_id),
  CONSTRAINT tool_unique_photo UNIQUE (photo, organization_id)
);

CREATE UNIQUE INDEX ON public.tool (id);
CREATE INDEX ON public.tool (type_id, brand_id, owner_id, status);

-- Make it so that the first tool will have id 10000
SELECT setval(pg_get_serial_sequence('tool', 'id'), 9999, true);

COMMIT;
