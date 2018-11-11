BEGIN;

CREATE TABLE IF NOT EXISTS public.tool_snapshot (
  id                SERIAL           PRIMARY KEY,

  ---------------- Tool Data ------------------
	tool_id 					id_t             NOT NULL,
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
	"year" 						integer,

  ---------------- Snapshot Metadata ------------------
  timestamp              timestamp   NOT NULL DEFAULT now(),
  tool_action            tool_action NOT NULL,
  actor_id               id_t        NOT NULL,
  decomission_reason     text,
  CHECK (
    (decomission_reason IS NULL AND NOT is_decomissioned_status(status)) OR
    (decomission_reason IS NOT NULL AND is_decomissioned_status(status))
  )
);

CREATE INDEX ON public.tool_snapshot (tool_id);
CREATE INDEX ON public.tool_snapshot (organization_id);
CREATE INDEX ON public.tool_snapshot (tool_id, organization_id);

COMMIT;
