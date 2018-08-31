CREATE OR REPLACE FUNCTION public.update_configurable_item(
	configurable_item_id 	id_t,
	name 									str_t,
	sanctioned 						boolean,
  organization_id 			id_t
)
RETURNS SETOF public.configurable_item
AS $$
  BEGIN
    RETURN QUERY
    UPDATE public.configurable_item
    	SET
    		name 			 = update_configurable_item.name,
    		sanctioned = update_configurable_item.sanctioned
    	WHERE public.configurable_item.id = update_configurable_item.configurable_item_id
        AND public.configurable_item.organization_id = update_configurable_item.organization_id
    RETURNING *;
  END;
$$
LANGUAGE plpgsql;
