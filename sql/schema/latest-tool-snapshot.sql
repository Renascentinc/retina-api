
/**
 * A table containing all tool ids and the id of the latest tool snapshot
 * for each tool
 */
CREATE TABLE IF NOT EXISTS public.latest_tool_snapshot (
  tool_id          id_t PRIMARY KEY,
  tool_snapshot_id id_t UNIQUE
);
