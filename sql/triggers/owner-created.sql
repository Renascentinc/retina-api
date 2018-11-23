
/**
 * When a new user or location is created, this function is called in order
 * to create a new entry in the tool_owner_id table and the user_id table
 */
CREATE FUNCTION create_tool_owner_id () RETURNS TRIGGER
AS $$
  BEGIN
    INSERT INTO public.tool_owner_id (
      id,
      organization_id
    ) VALUES (
      NEW.id,
      NEW.organization_id
    );

    IF NEW.type = 'USER'::tool_owner_type THEN
      INSERT INTO public.user_id (
        id,
        organization_id
      ) VALUES (
        NEW.id,
        NEW.organization_id
      );
    END IF;

    RETURN NEW;
  END
$$
LANGUAGE plpgsql;

CREATE TRIGGER user_created AFTER INSERT
  ON public.user
  FOR EACH ROW
  EXECUTE PROCEDURE create_tool_owner_id();

CREATE TRIGGER location_created AFTER INSERT
  ON public.location
  FOR EACH ROW
  EXECUTE PROCEDURE create_tool_owner_id();
