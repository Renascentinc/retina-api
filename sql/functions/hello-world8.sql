CREATE OR REPLACE FUNCTION public.waga_func_8(part_one text, part_two text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
  DECLARE
    message text;
  BEGIN
      SELECT part_one as message into message;
      RETURN message;
  END;
$function$
