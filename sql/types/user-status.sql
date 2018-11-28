
DO $$

BEGIN

-- IF NOT EXITS logic pulled from https://levlaz.org/types-and-roles-if-not-exists-in-postgresql

IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
    CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE');
END IF;

END $$;
