DO $$

BEGIN

-- IF NOT EXITS logic pulled from https://levlaz.org/types-and-roles-if-not-exists-in-postgresql

IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
    CREATE TYPE transaction_type AS ENUM ('add', 'update', 'transfer');
END IF;

END $$;
