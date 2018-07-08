CREATE OR REPLACE FUNCTION helloWorld() RETURNS string AS $$
DECLARE
  message string;
BEGIN
    SELECT "Hello World" INTO message;
    RETURN message;
END;
$$ LANGUAGE plpgsql;
