

CREATE FUNCTION public.create_configurable_item (
	type configurable_item_type,
	name str_t,
	sanctioned boolean,
	organization_id id_t
)
RETURNS SETOF public.configurable_item
AS $$
  BEGIN
    RETURN QUERY
    	INSERT INTO public.configurable_item (
    		type,
    		name,
    		sanctioned,
    		organization_id
    	) VALUES (
    		type,
    		name,
    		sanctioned,
    		organization_id
    	) ON CONFLICT ON CONSTRAINT configurable_item_unique_type_name
          DO UPDATE
            SET
              deleted = false
            WHERE configurable_item.deleted = true
      RETURNING *;
  END;
$$
LANGUAGE plpgsql;
