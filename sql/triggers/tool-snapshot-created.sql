

CREATE FUNCTION retina.upsert_latest_tool_snapshot () RETURNS TRIGGER
AS $$
  BEGIN

    UPDATE tool_snapshot
      SET previous_tool_snapshot_id =
        (SELECT tool_snapshot_id
          FROM latest_tool_snapshot
            WHERE tool_id = NEW.tool_id)
      WHERE id = NEW.id;

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
  EXECUTE PROCEDURE retina.upsert_latest_tool_snapshot();
