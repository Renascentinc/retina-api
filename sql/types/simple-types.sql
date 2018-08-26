
DO $$

BEGIN

-- IF NOT EXITS logic pulled from https://levlaz.org/types-and-roles-if-not-exists-in-postgresql

IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'zip_t') THEN
  CREATE DOMAIN zip_t AS character varying(10);
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'long_str_t') THEN
  CREATE DOMAIN long_str_t AS character varying(200);
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'str_t') THEN
  CREATE DOMAIN str_t AS character varying(80);
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'id_t') THEN
  CREATE DOMAIN id_t AS integer;
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'state_t') THEN
  CREATE DOMAIN state_t AS character varying(2);
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'uuid_t') THEN
  CREATE DOMAIN uuid_t AS uuid;
END IF;

END $$;
