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
  CONSTRAINT tool_unique_photo UNIQUE (photo, organization_id)
  -- Constraint for unique tool is in triggers/tool-insert-update.sql
);

CREATE UNIQUE INDEX IF NOT EXISTS tool_id_index ON public.tool (id);
CREATE INDEX IF NOT EXISTS tool_filters_index ON public.tool (type_id, brand_id, owner_id, status);

-- Add "tagged" column to tools setting the tools that already exist to true (all tools in the production app had been tagged)
ALTER TABLE public.tool ADD COLUMN IF NOT EXISTS tagged BOOL NOT NULL DEFAULT false;

COMMIT;

DO $$

BEGIN
-- Make it so that the first tool will have id 10000
IF NOT (SELECT EXISTS (SELECT 1 FROM public.tool)) THEN
  PERFORM setval(pg_get_serial_sequence('tool', 'id'), 9999, true);
END IF;

END $$;
