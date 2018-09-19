BEGIN;

CREATE VIEW tool_search_item_view AS
	SELECT
  	coalesce(public.user.first_name, '') as user_first_name,
  	coalesce(public.user.last_name, '') as user_last_name,
  	tool.id::text as tool_id,
  	brand.name as brand_name,
  	type.name as type_name,
  	tool.model_number as tool_model_number,
  	tool.serial_number as tool_serial_number,
  	coalesce(public.location.name, '') as location_name,
  	tool.status::text as tool_status,
  	tool.organization_id as tool_organization_id
  	from tool

  	left join public.user on public.user.id = tool.user_id
    left join public.location on public.location.id = tool.location_id
  	join public.configurable_item as brand on brand.id = tool.brand_id
  	join public.configurable_item as type on type.id = tool.type_id;

COMMIT;
