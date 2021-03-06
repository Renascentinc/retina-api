
CREATE FUNCTION retina.get_all_user(
  organization_id id_t,
  page_size       integer = NULL,
  page_number     integer = 0
) RETURNS SETOF public.user
AS $$
  BEGIN
    RETURN QUERY
    	SELECT * FROM public.user
    	WHERE public.user.organization_id = get_all_user.organization_id
        AND public.user.status = 'ACTIVE'::user_status
      ORDER BY public.user.last_name ASC
      OFFSET page_number*page_size
      LIMIT page_size;
  END;
$$
LANGUAGE plpgsql;
