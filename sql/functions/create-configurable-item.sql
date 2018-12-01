

CREATE FUNCTION retina.create_configurable_item (
	type configurable_item_type,
	name str_t,
	sanctioned boolean,
	organization_id id_t
)
RETURNS SETOF public.configurable_item
AS $$
  DECLARE
    constraint_name text;
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

   EXCEPTION
    WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS constraint_name := CONSTRAINT_NAME;
      IF constraint_name = 'configurable_item_unique_deleted' THEN
        RETURN QUERY
          UPDATE public.configurable_item
            SET deleted = false
              WHERE configurable_item.type = create_configurable_item.type
                AND configurable_item.name = create_configurable_item.name
                AND configurable_item.organization_id = create_configurable_item.organization_id
            RETURNING *;
      ELSE
        RAISE;
      END IF;
  END;
$$
LANGUAGE plpgsql;
