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
	date_purchased 		date,
	purchased_from_id id_t,
	price 						integer,
	photo 						long_str_t,
	"year" 						integer,
  PRIMARY KEY (id, organization_id),
  CONSTRAINT tool_unique_model_number UNIQUE (model_number, organization_id),
  CONSTRAINT tool_unique_serial_number UNIQUE (serial_number, organization_id),
  CONSTRAINT tool_unique_photo UNIQUE (photo, organization_id)
);

CREATE UNIQUE INDEX ON public.tool (id);
CREATE INDEX ON public.tool (type_id, brand_id, owner_id, status);

COMMIT;
