
CREATE FUNCTION retina.get_password_reset_credentials_by_code(
  password_reset_code uuid_t
)
 RETURNS SETOF public.password_reset_credentials
AS $$
  BEGIN
    RETURN QUERY
      SELECT * FROM public.password_reset_credentials
        WHERE code = password_reset_code
        AND retina.is_user_active(public.password_reset_credentials.user_id);
  END;
$$
LANGUAGE plpgsql;
