
BEGIN;

CREATE TABLE IF NOT EXISTS public.tool_snapshot_metadata (
  tool_snapshot_id       id_t             NOT NULL,
  tool_action            tool_action      NOT NULL,
  timestamp              timestamp        DEFAULT now(), --maybe NOT NULL?
  creator_id             id_t,
	out_of_service_reason  text
);

-- create constraint for creator_id <==> tool_action == CREATE
-- create constraint for out_of_service_reason <==> tool_status is out of service
CREATE UNIQUE INDEX ON public.session (token);

COMMIT;
