
/*
 * Dynamic query creation pulled from https://stackoverflow.com/questions/30212336/select-from-table-where-column-anything
 *
 * Create a base query assuming all tools will be selected from an organization. Then append filters to
 * the base query based on what filter values aren't null.
 *
 * I'm assuming SQL injection won't be a problem here because only integers and enums are being passed in.
 */
CREATE OR REPLACE FUNCTION public.search_strict_tool (
  organization_id id_t,
  user_ids        integer[]     = NULL,
  brand_ids       integer[]     = NULL,
  type_ids        integer[]     = NULL,
  tool_statuses   tool_status[] = NULL,
  page_size       integer       = NULL,
  page_number     integer       = 0
)
RETURNS SETOF public.tool
AS $$
  DECLARE
    query text = 'SELECT * FROM public.tool WHERE organization_id = ' || organization_id;
  BEGIN

    IF user_ids IS NOT NULL THEN
      query = query || ' AND user_id IN (SELECT id FROM unnest($1) as id)';
      IF array_contains_null(user_ids) THEN
        query = query || ' OR user_id IS NULL';
      END IF;
    END IF;

    IF brand_ids IS NOT NULL THEN
      query = query || ' AND brand_id IN (SELECT id FROM unnest($2) as id)';
      IF array_contains_null(brand_ids) THEN
        query = query || ' OR brand_id IS NULL';
      END IF;
    END IF;

    IF type_ids IS NOT NULL THEN
      query = query || ' AND type_id IN (SELECT id FROM unnest($3) as id)';
      IF array_contains_null(type_ids) THEN
        query = query || ' OR type_id IS NULL';
      END IF;
    END IF;

    IF tool_statuses IS NOT NULL THEN
      query = query || ' AND status IN (SELECT status FROM unnest($4) as status)';
      IF array_contains_null(tool_statuses) THEN
        query = query || ' OR status IS NULL';
      END IF;
    END IF;

    query = query ||
      ' ORDER BY tool.id ASC' ||
      ' OFFSET $5' ||
      ' LIMIT $6';

    RETURN QUERY EXECUTE query USING user_ids,
                                     brand_ids,
                                     type_ids,
                                     tool_statuses,
                                     page_number*page_size,
                                     page_size;

  END;
$$
LANGUAGE plpgsql;
