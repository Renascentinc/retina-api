CREATE OR REPLACE FUNCTION public.delete_configurable_item(
	configurable_item_id  id_t,
  organization_id 			id_t
)
RETURNS SETOF public.configurable_item
AS $$
  BEGIN
    RETURN QUERY
		  UPDATE public.configurable_item
        SET deleted = true
		      WHERE public.configurable_item.id = delete_configurable_item.configurable_item_id
          AND public.configurable_item.organization_id = delete_configurable_item.organization_id
	  RETURNING *;
  END;
$$
LANGUAGE plpgsql;
