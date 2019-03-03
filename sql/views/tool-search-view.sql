BEGIN;

/*
 * A view to simplify tool searching. It joins together all the fields that
 * a tool needs to be searched on. It also assures all fields will be of type text
 */
CREATE OR REPLACE VIEW tool_search_view AS
  SELECT
    COALESCE(public.user.first_name, '') AS user_first_name,
    COALESCE(public.user.last_name, '') AS user_last_name,
    tool.id::text AS tool_id,
    brand.name AS brand_name,
    type.name AS type_name,
    tool.model_number AS tool_model_number,
    tool.serial_number AS tool_serial_number,
    COALESCE(public.location.name, '') AS location_name,
    tool.status::text AS tool_status,
    tool.tagged::text AS tagged
    FROM tool

    LEFT JOIN public.user ON public.user.id = tool.owner_id
    LEFT JOIN public.location ON public.location.id = tool.owner_id
    JOIN public.configurable_item AS brand ON brand.id = tool.brand_id
    JOIN public.configurable_item AS type ON type.id = tool.type_id

    WHERE retina.is_in_service_status(tool.status);

COMMIT;
