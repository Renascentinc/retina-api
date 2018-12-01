
CREATE FUNCTION retina.check_configurable_item_unique () RETURNS TRIGGER
AS $$
  DECLARE
    existing_configurable_item_deleted boolean;
  BEGIN
    SELECT deleted INTO existing_configurable_item_deleted
      FROM public.configurable_item
        WHERE
          organization_id = NEW.organization_id
          AND type = NEW.type
          AND name = NEW.name
          AND id != NEW.id
      LIMIT 1;

    IF existing_configurable_item_deleted IS NOT NULL THEN
      IF existing_configurable_item_deleted THEN
        RAISE EXCEPTION
          'Configurable item with type % and name % already exists in deleted state', NEW.type, NEW.name
          USING CONSTRAINT = 'configurable_item_unique_deleted';
      /* ELSE
        RAISE EXCEPTION
          'Configurable item with type % and name % already exists', NEW.type, NEW.name
          USING CONSTRAINT = 'configurable_item_unique'; */
      END IF;
    END IF;

    RETURN NEW;
  END
$$
LANGUAGE plpgsql;

CREATE TRIGGER configurable_item_unique BEFORE INSERT OR UPDATE
  ON public.configurable_item
  FOR EACH ROW
  EXECUTE PROCEDURE retina.check_configurable_item_unique();
