

CREATE FUNCTION check_tool_unique () RETURNS TRIGGER
AS $$
  DECLARE
    existing_tool_status tool_status;
  BEGIN
    existing_tool_status :=
        (
          SELECT status FROM tool
            WHERE
              organization_id = NEW.organization_id
              AND brand_id = NEW.brand_id
              AND model_number = NEW.model_number
              AND serial_number = NEW.serial_number
              AND id != NEW.id
          LIMIT 1
        );

    IF existing_tool_status IS NOT NULL THEN
      IF retina.is_in_service_status(existing_tool_status) THEN
        RAISE EXCEPTION
          'Tool with serial number %, model number %, and brand id % already exists in service',
            NEW.serial_number,
            NEW.model_number,
            NEW.brand_id
          USING CONSTRAINT = 'tool_unique_in_service';
      ELSIF (NOT retina.is_in_service_status(existing_tool_status)) THEN
        RAISE EXCEPTION
          'Tool with serial number %, model number %, and brand id % already exists in decomissioned state',
            NEW.serial_number,
            NEW.model_number,
            NEW.brand_id
          USING CONSTRAINT = 'tool_unique_decomissioned';
      END IF;
    END IF;

    RETURN NEW;
  END
$$
LANGUAGE plpgsql;

CREATE TRIGGER tool_unique BEFORE INSERT OR UPDATE
  ON public.tool
  FOR EACH ROW
  EXECUTE PROCEDURE check_tool_unique();
