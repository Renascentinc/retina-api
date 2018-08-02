CREATE OR REPLACE FUNCTION public.other_func_wigie(first_name text, last_name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
  DECLARE
    message text;
  BEGIN
      SELECT first_name as message into message;
      RETURN message;
  END;
$function$