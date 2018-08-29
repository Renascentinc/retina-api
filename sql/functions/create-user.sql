CREATE OR REPLACE FUNCTION public.create_user () RETURNS SETOF public.user
AS $$
  BEGIN
    RETURN QUERY INSERT INTO public.user DEFAULT VALUES RETURNING *;
  END;
$$
LANGUAGE plpgsql;
