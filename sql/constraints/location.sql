ALTER TABLE public."location"
ADD FOREIGN KEY (organization_id)
  REFERENCES public.organization (id)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;
