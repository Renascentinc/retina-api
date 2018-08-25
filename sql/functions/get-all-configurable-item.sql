
CREATE FUNCTION public.get_all_configurable_item (
	organization_id integer
)
 RETURNS SETOF public.configurable_item
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM public.configurable_item
    	WHERE public.configurable_item.organization_id = get_all_configurable_item.organization_id;
  END;
$$
LANGUAGE plpgsql;
