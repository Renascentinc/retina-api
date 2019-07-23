
/*
 * Dynamic query creation pulled from https://stackoverflow.com/questions/30212336/select-from-table-where-column-anything
 *
 * Create a base query assuming all tools will be selected from an organization. Then append filters to
 * the base query based on what filter values aren't null.
 *
 * I'm assuming SQL injection won't be a problem here because only integers and enums are being passed in.
 */
CREATE OR REPLACE FUNCTION retina.search_strict_tool (
  organization_id id_t,
  owner_ids       integer[]     = NULL,
  brand_ids       integer[]     = NULL,
  type_ids        integer[]     = NULL,
  tool_statuses   tool_status[] = NULL,
  tagged          boolean       = NULL,
  page_size       integer       = NULL,
  page_number     integer       = 0
)
RETURNS SETOF public.tool
AS $$
  DECLARE
    queryString text = 'SELECT * FROM public.tool WHERE organization_id = ' || organization_id || ' AND retina.is_in_service_status(tool.status)';
  BEGIN

    IF owner_ids IS NOT NULL AND array_length(owner_ids, 1) > 0 THEN
      queryString = queryString || ' AND owner_id IN ' || retina.array_to_string_list(owner_ids);
    END IF;

    IF brand_ids IS NOT NULL AND array_length(brand_ids, 1) > 0 THEN
      queryString = queryString || ' AND brand_id IN ' || retina.array_to_string_list(brand_ids);
    END IF;

    IF type_ids IS NOT NULL AND array_length(type_ids, 1) > 0 THEN
      queryString = queryString || ' AND type_id IN ' || retina.array_to_string_list(type_ids);
    END IF;

    IF tool_statuses IS NOT NULL AND array_length(tool_statuses, 1) > 0 THEN
      queryString = queryString || ' AND status IN ' || retina.array_to_string_list(tool_statuses);
    END IF;

    IF tagged IS NOT NULL THEN
      queryString = queryString || ' AND tagged = ' || tagged;
    END IF;

    queryString = queryString || ' ORDER BY tool.id ASC ';

    IF page_size IS NOT NULL THEN
      queryString = queryString || ' OFFSET ' || page_number*page_size || ' LIMIT ' || page_size;
    END IF;

    RETURN QUERY EXECUTE queryString;

  END;
$$
LANGUAGE plpgsql;
