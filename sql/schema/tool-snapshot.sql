BEGIN;

CREATE TABLE IF NOT EXISTS public.tool_snapshot (
	id 								id_t             NOT NULL,
  time              timestamp        DEFAULT now(),
	type_id 					id_t 						 NOT NULL,
	brand_id 					id_t 						 NOT NULL,
	model_number 			str_t 					 NOT NULL,
	status 						tool_status      NOT NULL,
	organization_id 	id_t 						 NOT NULL,
	serial_number 		str_t			 			 NOT NULL,
  owner_id          id_t             NOT NULL,
  owner_type        tool_owner_type  NOT NULL,
  tool_action       tool_action      NOT NULL,
	date_purchased 		date,
	purchased_from_id id_t,
	price 						integer,
	photo 						long_str_t,
	"year" 						integer
);

CREATE INDEX ON public.tool_snapshot (id);
CREATE INDEX ON public.tool_snapshot (organization_id);
CREATE INDEX ON public.tool_snapshot (id, organization_id);

COMMIT;
