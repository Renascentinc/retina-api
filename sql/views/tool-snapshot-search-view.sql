BEGIN;

/*
 * A view to simplify tool snapshot searching. It joins together all the fields that
 * a tool snapshot needs to be searched on. It also assures all fields will be of type text
 */
CREATE OR REPLACE VIEW tool_snapshot_search_view AS
  SELECT
    COALESCE(public.user.first_name, '') AS user_first_name,
    COALESCE(public.user.last_name, '') AS user_last_name,
    tool_snapshot.tool_id::text AS tool_id,
    tool_snapshot.id::text AS tool_snapshot_id,
    brand.name AS brand_name,
    type.name AS type_name,
    tool_snapshot.model_number AS tool_model_number,
    tool_snapshot.serial_number AS tool_serial_number,
    COALESCE(public.location.name, '') AS location_name,
    tool_snapshot.status::text AS tool_status,
    tool_snapshot.tool_action::text AS tool_action
    FROM tool_snapshot

    LEFT JOIN public.user ON public.user.id = tool_snapshot.owner_id
    LEFT JOIN public.location ON public.location.id = tool_snapshot.owner_id
    JOIN public.configurable_item AS brand ON brand.id = tool_snapshot.brand_id
    JOIN public.configurable_item AS type ON type.id = tool_snapshot.type_id;
COMMIT;
