ALTER TABLE public."latest_tool_snapshot"
ADD FOREIGN KEY (tool_id)
  REFERENCES public.tool (id)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

ALTER TABLE public."latest_tool_snapshot"
ADD FOREIGN KEY (tool_snapshot_id)
  REFERENCES public.tool_snapshot (id)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;
