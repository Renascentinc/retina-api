
/**
 * For each passed in tool id, update only those tools that are
 * - in the organization
 * - owned by the transferrer (unless the transferrer is an admin, or the tool
 *   owner type is a location, in which case any tool can be transferred)
 * - do not already belong to the owner being transferred to
 *
 * Each tool that is updated is added to the updated_tool_ids list. Finally,
 * all the updated tools are returned.
 */
CREATE OR REPLACE FUNCTION public.transfer_tool (
	tool_id_list    integer[],
	to_owner_id 	  id_t,
  organization_id id_t,
  transferrer_id  id_t
)
RETURNS SETOF public.tool
AS $$
  DECLARE
    tool_id          id_t;
    updated_tool_id  integer;
    updated_tool_ids integer[];
  BEGIN
    FOREACH tool_id IN ARRAY tool_id_list LOOP
      updated_tool_id = NULL;

      UPDATE public.tool
        SET
          owner_id = to_owner_id,
          status =
            CASE
              WHEN (SELECT status FROM tool WHERE tool.id = tool_id) = 'AVAILABLE'::tool_status AND
                   (SELECT type FROM tool_owner WHERE tool_owner.id = to_owner_id) = 'USER'::tool_owner_type
              THEN 'IN_USE'::tool_status

              WHEN (SELECT status FROM tool WHERE tool.id = tool_id) = 'IN_USE'::tool_status AND
                   (SELECT type FROM tool_owner WHERE tool_owner.id = to_owner_id) = 'LOCATION'::tool_owner_type
              THEN 'AVAILABLE'::tool_status

              ELSE status
            END
        WHERE public.tool.id = tool_id
          AND public.tool.organization_id = transfer_tool.organization_id
          AND public.tool.owner_id != to_owner_id
          AND public.tool.owner_id =
            CASE
              WHEN (SELECT role FROM public.user WHERE id = transferrer_id) != 'ADMINISTRATOR'::role AND
                   (SELECT owner_type FROM public.tool WHERE id = tool_id) != 'LOCATION'::tool_owner_type
              THEN transferrer_id
              ELSE public.tool.owner_id
            END
        RETURNING id INTO updated_tool_id;

        IF updated_tool_id IS NOT NULL THEN
          updated_tool_ids = array_append(updated_tool_ids, updated_tool_id);
        END IF;
    END LOOP;

    RETURN QUERY SELECT * FROM tool
      WHERE tool.id in (SELECT * from unnest(updated_tool_ids))
        AND tool.organization_id = transfer_tool.organization_id;
  END;
$$
LANGUAGE plpgsql;
