BEGIN;

CREATE TABLE IF NOT EXISTS public.tool_history (
  time              timestamp        DEFAULT now(),
	id 								id_t             NOT NULL,
	type_id 					id_t 						 NOT NULL,
	brand_id 					id_t 						 NOT NULL,
	model_number 			str_t 					 NOT NULL,
	status 						tool_status      NOT NULL,
	organization_id 	id_t 						 NOT NULL,
	serial_number 		str_t			 			 NOT NULL,
  owner_id          id_t             NOT NULL,
  owner_type        tool_owner_type  NOT NULL,
	date_purchased 		date,
	purchased_from_id id_t,
	price 						integer,
	photo 						long_str_t,
	"year" 						integer
);

CREATE INDEX ON public.tool_history (id);
CREATE INDEX ON public.tool_history (organization_id);
CREATE INDEX ON public.tool_history (id, organization_id);

COMMIT;
