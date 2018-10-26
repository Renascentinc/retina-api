
CREATE FUNCTION update_tool_owner_type ()
  RETURNS TRIGGER
AS $$
  BEGIN
    UPDATE public.tool
      SET
        owner_type = (SELECT type from tool_owner where id = NEW.owner_id)
      WHERE public.tool.id = NEW.id
        AND public.tool.organization_id = NEW.organization_id;

    RETURN NEW;
  END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tool_owner_id_updated AFTER UPDATE
  ON public.tool
  FOR EACH ROW
  WHEN (OLD.owner_id IS DISTINCT FROM NEW.owner_id)
  EXECUTE PROCEDURE update_tool_owner_type();
