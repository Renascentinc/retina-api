
CREATE FUNCTION public.get_configurable_item(
	id 							id_t,
	organization_id id_t
)
 RETURNS SETOF public.configurable_item
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM public.configurable_item
    	WHERE public.configurable_item.id = get_configurable_item.id
			AND public.configurable_item.organization_id = get_configurable_item.organization_id;
  END;
$$
LANGUAGE plpgsql;
