

CREATE FUNCTION upsert_latest_tool_snapshot ()
  RETURNS TRIGGER
AS $$
  BEGIN
    INSERT INTO public.latest_tool_snapshot (
      tool_id,
      tool_snapshot_id
    ) VALUES (
      NEW.tool_id,
      NEW.id
    ) ON CONFLICT (tool_id)
        DO UPDATE
          SET tool_snapshot_id = NEW.id;

    RETURN NEW;
  END
$$
LANGUAGE plpgsql;


CREATE TRIGGER tool_snapshot_created AFTER INSERT
  ON public.tool_snapshot
  FOR EACH ROW
  EXECUTE PROCEDURE upsert_latest_tool_snapshot();
