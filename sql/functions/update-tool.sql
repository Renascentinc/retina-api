CREATE FUNCTION public.update_tool(
  id              int,
  class           char varying(80)  = NULL,
  type            char varying(80)  = NULL,
  brand           char varying(80)  = NULL,
  date_purchased  date              = NULL,
  purchased_from  char varying(80)  = NULL,
  price           integer           = NULL,
  model_number    char varying(80)  = NULL,
  status          char varying(80)  = NULL,
  photo           char varying(200) = NULL
)
 RETURNS SETOF public.tool
AS $$
  BEGIN
    RETURN QUERY
    UPDATE public.tool
      SET
        class = update_tool.class,
        type = update_tool.type,
        brand = update_tool.brand,
        date_purchased = update_tool.date_purchased,
        purchased_from = update_tool.purchased_from,
        price = update_tool.price,
        model_number = update_tool.model_number,
        status = update_tool.status,
        photo = update_tool.photo
      WHERE public.tool.id = update_tool.id
    RETURNING *;
  END;
$$
LANGUAGE plpgsql;
