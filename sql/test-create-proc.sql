CREATE OR REPLACE FUNCTION helloWorlddd() RETURNS varchar AS $$
DECLARE
  message varchar;
BEGIN
    SELECT 'Hello World' as message into message;
    RETURN message;
END;
$$ LANGUAGE plpgsql;
