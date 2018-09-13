CREATE FUNCTION public.create_session (
	token           long_str_t,
  user_id         id_t,
  organization_id id_t
)
RETURNS SETOF public.session
AS $$
  BEGIN
    RETURN QUERY
    	INSERT INTO public.session (
    		token,
        user_id,
        organization_id
    	) VALUES (
        token,
        user_id,
        organization_id
    	) RETURNING *;
  END;
$$
LANGUAGE plpgsql;
