DO $$

BEGIN

-- IF NOT EXITS logic pulled from https://levlaz.org/types-and-roles-if-not-exists-in-postgresql

IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tool_status') THEN
    CREATE TYPE tool_status AS ENUM ('AVAILABLE',
                                     'IN_USE',
                                     'MAINTENANCE',
                                     'BEYOND_REPAIR',
                                     'LOST_OR_STOLEN');
END IF;

END $$;
