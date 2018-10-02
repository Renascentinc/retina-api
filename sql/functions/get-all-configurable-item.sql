
CREATE OR REPLACE FUNCTION public.get_all_configurable_item (
	organization_id integer,
  page_size integer = NULL,
  page_number integer = 0
)
 RETURNS SETOF public.configurable_item
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM public.configurable_item
    	WHERE public.configurable_item.organization_id = get_all_configurable_item.organization_id
      OFFSET page_number*page_size LIMIT page_size;
  END;
$$
LANGUAGE plpgsql;
