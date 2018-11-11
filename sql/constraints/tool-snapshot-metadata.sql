ALTER TABLE public.tool_snapshot_metadata
ADD FOREIGN KEY (tool_snapshot_id)
REFERENCES public.tool_snapshot (id)
	ON DELETE RESTRICT
	ON UPDATE RESTRICT;
