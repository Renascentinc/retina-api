
CREATE OR REPLACE FUNCTION public.add_tool (
  class           char varying(80)  = NULL,
  type            char varying(80)  = NULL,
  brand           char varying(80)  = NULL,
  date_purchased  date              = NULL,
  purchased_from  char varying(80)  = NULL,
  price           integer           = NULL,
  model_number    char varying(80)  = NULL,
  status          char varying(80)  = NULL,
  photo           char varying(200) = NULL
) RETURNS SETOF public.tool
AS
$function$
  BEGIN
    RETURN QUERY
      INSERT INTO public.tool (
        class,
        type,
        brand,
        date_purchased,
        purchased_from,
        price,
        model_number,
        status,
        photo
      )
      VALUES (
        class,
        type,
        brand,
        date_purchased,
        purchased_from,
        price,
        model_number,
        status,
        photo
      ) RETURNING *;
  END;
$function$
LANGUAGE plpgsql;
