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

IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'decomissioned_tool_status') THEN
    CREATE TYPE decomissioned_tool_status AS ENUM ('BEYOND_REPAIR',
                                                   'LOST_OR_STOLEN');
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'in_service_tool_status') THEN
    CREATE TYPE in_service_tool_status AS ENUM ('IN_USE',
                                                'MAINTENANCE',
                                                'AVAILABLE');
END IF;

END $$;

-- TODO: Make a `helpers` directory under functions and put this in there
CREATE FUNCTION retina.is_in_service_status(
	tool_status tool_status
)
 RETURNS BOOL
AS $$
  BEGIN
    RETURN
      is_in_service_status.tool_status != 'BEYOND_REPAIR'::tool_status AND
      is_in_service_status.tool_status != 'LOST_OR_STOLEN'::tool_status AND
      is_in_service_status.tool_status IS NOT NULL;
  END;
$$
LANGUAGE plpgsql
IMMUTABLE;
