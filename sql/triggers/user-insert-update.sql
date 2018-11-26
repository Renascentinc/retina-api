
CREATE FUNCTION check_user_unique () RETURNS TRIGGER
AS $$
  DECLARE
    existing_user_status user_status;
  BEGIN
    existing_user_status :=
        (
          SELECT status FROM public.user
            WHERE
              organization_id = NEW.organization_id
              AND email = NEW.email
              AND id != NEW.id
          LIMIT 1
        );

    IF existing_user_status IS NOT NULL THEN
      IF existing_user_status = 'ACTIVE'::user_status THEN
        RAISE EXCEPTION
          'User with email % already exists in active state', NEW.email
          USING CONSTRAINT = 'user_unique_active';
      ELSIF existing_user_status = 'INACTIVE'::user_status THEN
        RAISE EXCEPTION
          'User with email % already exists in inactive state', NEW.email
          USING CONSTRAINT = 'user_unique_inactive';
      END IF;
    END IF;

    RETURN NEW;
  END
$$
LANGUAGE plpgsql;

CREATE TRIGGER user_unique BEFORE INSERT OR UPDATE
  ON public.user
  FOR EACH ROW
  EXECUTE PROCEDURE check_user_unique();
