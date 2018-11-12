
CREATE FUNCTION public.is_user_inactive(
	user_id          id_t
)
 RETURNS Boolean
AS $$
  BEGIN
    RETURN (SELECT status FROM public.user WHERE public.user.id = user_id) = 'INACTIVE'::user_status;
  END;
$$
LANGUAGE plpgsql;
