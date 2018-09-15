DO $$

BEGIN

-- IF NOT EXITS logic pulled from https://levlaz.org/types-and-roles-if-not-exists-in-postgresql

IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tool_status_type') THEN
    CREATE TYPE tool_status_type AS ENUM ('AVAILABLE',
                                          'IN_USE',
                                          'MAINTENENCE',
                                          'OUT_OF_SERVICE');
END IF;

END $$;
