DO $$

BEGIN

-- IF NOT EXITS logic pulled from https://levlaz.org/types-and-roles-if-not-exists-in-postgresql

IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tool_action') THEN
    CREATE TYPE tool_action AS ENUM ('CREATE', 'UPDATE', 'TRANSFER');
END IF;

END $$;
