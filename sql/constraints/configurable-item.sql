ALTER TABLE public.configurable_item
ADD FOREIGN KEY (organization_id)
  REFERENCES public.organization (id)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;
