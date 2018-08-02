CREATE OR REPLACE FUNCTION public.hello_world(part_one text, part_two text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
  DECLARE
    message text;
  BEGIN
      SELECT part_one as title into message;
      RETURN message;
  END;
$function$
