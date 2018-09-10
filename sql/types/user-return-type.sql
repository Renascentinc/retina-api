

DO $$

BEGIN

-- IF NOT EXITS logic pulled from https://levlaz.org/types-and-roles-if-not-exists-in-postgresql
/* 
IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_return_type') THEN
  CREATE TYPE user_return_type AS (
    id   				 		id_t,
    first_name			str_t,
    last_name				str_t,
    email						str_t,
    phone_number		short_str_t,
    role				 		role_type,
    status			 		user_status_type,
    organization_id id_t
  );
END IF; */

END $$;
