DO $$

BEGIN

-- IF NOT EXITS logic pulled from https://levlaz.org/types-and-roles-if-not-exists-in-postgresql

IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_type') THEN
    CREATE TYPE role_type AS ENUM ('user', 'administrator');
END IF;

END $$;
