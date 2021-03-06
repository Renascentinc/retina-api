BEGIN;

CREATE TABLE IF NOT EXISTS public.tool_snapshot (
  id                        SERIAL PRIMARY KEY,
  previous_tool_snapshot_id id_t,

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
    (CASE WHEN NOT retina.is_in_service_status(status) THEN action_note IS NOT NULL END)
  )
);

-- Add column to track wether the tool has an NFC tag
ALTER TABLE public.tool_snapshot ADD COLUMN IF NOT EXISTS tagged BOOL NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS tool_snapshot_tool_id_index ON public.tool_snapshot (tool_id);
CREATE INDEX IF NOT EXISTS tool_snapshot_organization_id_index ON public.tool_snapshot (organization_id);
CREATE INDEX IF NOT EXISTS tool_snapshot_tool_id_organization_id_index ON public.tool_snapshot (tool_id, organization_id);

COMMIT;
