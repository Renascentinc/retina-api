DO $$

BEGIN

-- IF NOT EXITS logic pulled from https://levlaz.org/types-and-roles-if-not-exists-in-postgresql

IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tool_owner_type') THEN
    CREATE TYPE tool_owner_type AS ENUM ('LOCATION', 'USER');
END IF;

END $$;
