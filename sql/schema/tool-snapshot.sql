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
	date_purchased 		timestamp,
	purchased_from_id id_t,
	price 						integer,
	photo 						long_str_t,
	"year" 						integer,

  ---------------- Snapshot Metadata ------------------
  timestamp              timestamp   NOT NULL DEFAULT now(),
  tool_action            tool_action NOT NULL,
  actor_id               id_t        NOT NULL,
  action_note            text,
  CHECK (
    (CASE WHEN NOT is_in_service_status(status) THEN action_note IS NOT NULL END)
  )
);

CREATE INDEX ON public.tool_snapshot (tool_id);
CREATE INDEX ON public.tool_snapshot (organization_id);
CREATE INDEX ON public.tool_snapshot (tool_id, organization_id);

COMMIT;
