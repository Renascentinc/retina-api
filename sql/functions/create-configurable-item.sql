

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
    	) RETURNING *;
  END;
$$
LANGUAGE plpgsql;
