

/*
 * Dynamic query creation pulled from https://stackoverflow.com/questions/30212336/select-from-table-where-column-anything
 *
 * Create a base query assuming all tools will be selected from an organization. Then append filters to
 * the base query based on what filter values aren't null.
 *
 * I'm assuming SQL injection won't be a problem here because only integers and enums are being passed in.
 */
CREATE OR REPLACE FUNCTION public.search_strict_tool_snapshot (
  organization_id      id_t,
  only_latest_snapshot boolean       = false,
  tool_ids             integer[]     = NULL,

  -------- Tool Search Params --------
  owner_ids            integer[]     = NULL,
  brand_ids            integer[]     = NULL,
  type_ids             integer[]     = NULL,
  tool_statuses        tool_status[] = NULL,

  -------- Metadata Search Params --------
  tool_actions         tool_action[] = NULL,
  start_time           timestamp     = NULL,
  end_time             timestamp     = NULL,

  page_size            integer       = NULL,
  page_number          integer       = 0
)
RETURNS SETOF public.tool_snapshot
AS $$
  DECLARE
    query text = 'SELECT * FROM public.tool_snapshot WHERE organization_id = ' || organization_id;
  BEGIN

    IF only_latest_snapshot THEN
      query = query || ' AND id IN (SELECT tool_snapshot_id FROM latest_tool_snapshot)';
    END IF;

    IF tool_ids IS NOT NULL AND array_length(tool_ids, 1) > 0 THEN
      query = query || ' AND tool_id IN (SELECT id FROM unnest($1) as id)';
    END IF;

    IF start_time IS NOT NULL THEN
      query = query || ' AND tool_snapshot.timestamp >= $2';
    END IF;

    IF end_time IS NOT NULL THEN
      query = query || ' AND tool_snapshot.timestamp <= $3';
    END IF;

    IF owner_ids IS NOT NULL AND array_length(owner_ids, 1) > 0 THEN
      query = query || ' AND owner_id IN (SELECT id FROM unnest($4) as id)';
    END IF;

    IF brand_ids IS NOT NULL AND array_length(brand_ids, 1) > 0 THEN
      query = query || ' AND brand_id IN (SELECT id FROM unnest($5) as id)';
    END IF;

    IF type_ids IS NOT NULL AND array_length(type_ids, 1) > 0 THEN
      query = query || ' AND type_id IN (SELECT id FROM unnest($6) as id)';
    END IF;

    IF tool_statuses IS NOT NULL AND array_length(tool_statuses, 1) > 0 THEN
      query = query || ' AND status IN (SELECT status FROM unnest($7) as status)';
    END IF;

    IF tool_actions IS NOT NULL AND array_length(tool_actions, 1) > 0 THEN
      query = query || ' AND tool_action IN (SELECT action FROM unnest($8) as action)';
    END IF;

    query = query ||
      ' ORDER BY tool_snapshot.timestamp DESC' ||
      ' OFFSET $9' ||
      ' LIMIT $10';

    RETURN QUERY EXECUTE query USING tool_ids,
                                     start_time,
                                     end_time,
                                     owner_ids,
                                     brand_ids,
                                     type_ids,
                                     tool_statuses,
                                     tool_actions,
                                     page_number*page_size,
                                     page_size;

  END;
$$
LANGUAGE plpgsql;
