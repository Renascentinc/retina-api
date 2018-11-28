CREATE OR REPLACE FUNCTION public.create_user (
	first_name			str_t,
	last_name				str_t,
	email						str_t,
	phone_number		short_str_t,
	password				str_t,
	role				 		role,
	status			 		user_status,
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
        organization_id,
        type
      ) VALUES (
        first_name,
        last_name,
        LOWER(email),
        phone_number,
        crypt(password, gen_salt('bf')),
        role,
        status,
        organization_id,
        'USER'::tool_owner_type
      ) RETURNING *;
  END;
$$
LANGUAGE plpgsql;
