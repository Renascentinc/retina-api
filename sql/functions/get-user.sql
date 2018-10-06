

CREATE FUNCTION public.get_user(
	user_id          id_t,
  organization_id  id_t
)
 RETURNS SETOF public.user
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM public.user
    	WHERE public.user.id = get_user.user_id
      AND public.user.organization_id = get_user.organization_id;
  END;
$$
LANGUAGE plpgsql;
