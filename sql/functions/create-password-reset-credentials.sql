
/**
 * Add user_id and organization_id to the password_reset_credentials table,
 * generating a random key for the code and setting an expiration date.
 * If there is a conflict on the unique_password_reset_credentials constaint
 * for table password_reset_credentials, simply update the code with a new random key
 */
CREATE FUNCTION public.create_password_reset_credentials (
  user_id         id_t,
  organization_id id_t
)
RETURNS SETOF public.password_reset_credentials
AS $$
  DECLARE
    password_reset_code uuid_t = uuid_generate_v4();
    code_expiration_date timestamp = now() + interval '2 hours';
  BEGIN
    RETURN QUERY
    	INSERT INTO public.password_reset_credentials (
    		code,
        user_id,
        organization_id,
        expiration_date
    	) VALUES (
        password_reset_code,
        create_password_reset_credentials.user_id,
        organization_id,
        code_expiration_date
    	) ON CONFLICT ON CONSTRAINT unique_password_reset_credentials
          DO UPDATE
            SET
              code = password_reset_code,
              expiration_date = code_expiration_date
      RETURNING *;
  END;
$$
LANGUAGE plpgsql;
