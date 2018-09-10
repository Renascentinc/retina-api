CREATE OR REPLACE FUNCTION public.create_user (
	first_name			str_t,
	last_name				str_t,
	email						str_t,
	phone_number		short_str_t,
	password				str_t,
	role				 		role_type,
	status			 		user_status_type,
	organization_id id_t
) RETURNS SETOF public.user
AS $$
  BEGIN
    RETURN QUERY
      INSERT INTO public.user (
        first_name,
        last_name,
        email,
        phone_number,
        password,
        role,
        status,
        organization_id
      ) VALUES (
        first_name,
        last_name,
        email,
        phone_number,
        crypt(password, gen_salt('bf')),
        role,
        status,
        organization_id
      ) RETURNING *;
  END;
$$
LANGUAGE plpgsql;
