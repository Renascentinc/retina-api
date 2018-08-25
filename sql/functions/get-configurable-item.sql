
CREATE FUNCTION public.get_configurable_item(
	id id_t
)
 RETURNS SETOF public.configurable_item
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM public.configurable_item
    	WHERE public.configurable_item.id = get_configurable_item.id;
  END;
$$
LANGUAGE plpgsql;
