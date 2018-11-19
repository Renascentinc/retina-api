

/*
 * Dynamic query creation pulled from https://stackoverflow.com/questions/30212336/select-from-table-where-column-anything
 *
 * Create a base query assuming all tools will be selected from an organization. Then append filters to
 * the base query based on what filter values aren't null.
 *
 * I'm assuming SQL injection won't be a problem here because only integers and enums are being passed in.
 */
CREATE OR REPLACE FUNCTION public.search_strict_tool_snapshot (
  organization_id id_t,
  tool_ids        integer[]     = NULL,
  owner_ids       integer[]     = NULL,
  tool_actions    tool_action[] = NULL,
  start_time      timestamp     = NULL,
  end_time        timestamp     = NULL,
  page_size       integer       = NULL,
  page_number     integer       = 0
)
RETURNS SETOF public.tool_snapshot
AS $$
  DECLARE
    query text = 'SELECT * FROM public.tool_snapshot WHERE organization_id = ' || organization_id;
  BEGIN

    IF tool_ids IS NOT NULL AND array_length(tool_ids, 1) > 0 THEN
      query = query || ' AND tool_id IN (SELECT id FROM unnest($1) as id)';
    END IF;

    -- TODO: Move the timestamp check earlier on in the query (maybe here?) to
    --       narrow the search more quickly

    IF owner_ids IS NOT NULL AND array_length(owner_ids, 1) > 0 THEN
      query = query || ' AND owner_id IN (SELECT id FROM unnest($2) as id)';
    END IF;

    IF tool_actions IS NOT NULL AND array_length(tool_actions, 1) > 0 THEN
      query = query || ' AND tool_action IN (SELECT status FROM unnest($3) as status)';
    END IF;

    IF start_time IS NOT NULL THEN
      query = query || ' AND tool_snapshot.timestamp >= $4';
    END IF;

    IF end_time IS NOT NULL THEN
      query = query || ' AND tool_snapshot.timestamp <= $5';
    END IF;

    query = query ||
      ' ORDER BY tool_snapshot.timestamp' ||
      ' OFFSET $6' ||
      ' LIMIT $7';

    RETURN QUERY EXECUTE query USING tool_ids,
                                     owner_ids,
                                     tool_actions,
                                     start_time,
                                     end_time,
                                     page_number*page_size,
                                     page_size;

  END;
$$
LANGUAGE plpgsql;
