
CREATE FUNCTION public.get_users()
 RETURNS SETOF public.user
AS $$
  BEGIN
    RETURN QUERY SELECT * FROM public.user;
  END;
$$
LANGUAGE plpgsql;
