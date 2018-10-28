
CREATE FUNCTION public.create_password_reset_credentials (
  user_id         id_t,
  organization_id id_t
)
RETURNS SETOF public.password_reset_credentials
AS $$
  BEGIN
    RETURN QUERY
    	INSERT INTO public.password_reset_credentials (
    		code,
        user_id,
        organization_id
    	) VALUES (
        uuid_generate_v4(),
        create_password_reset_credentials.user_id,
        organization_id
    	) ON CONFLICT ON CONSTRAINT unique_password_reset_credentials
          DO UPDATE SET code = uuid_generate_v4()
      RETURNING *;
  END;
$$
LANGUAGE plpgsql;
