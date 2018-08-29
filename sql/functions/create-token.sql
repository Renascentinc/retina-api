CREATE FUNCTION public.create_token (
	token           long_str_t,
  user_id         id_t,
  organization_id id_t
)
RETURNS SETOF public.token
AS $$
  BEGIN
    RETURN QUERY
    	INSERT INTO public.token (
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
