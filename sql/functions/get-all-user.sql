
CREATE FUNCTION public.get_all_user(
  organization_id id_t
) RETURNS SETOF public.user
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM public.user
    	WHERE public.user.organization_id = get_all_user.organization_id;
  END;
$$
LANGUAGE plpgsql;
