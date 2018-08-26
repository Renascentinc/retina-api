DO $$

BEGIN

-- IF NOT EXITS logic pulled from https://levlaz.org/types-and-roles-if-not-exists-in-postgresql

IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'configurable_item_type') THEN
    CREATE TYPE configurable_item_type AS ENUM ('BRAND', 'PURCHASED_FROM', 'TYPE');
END IF;

END $$;
