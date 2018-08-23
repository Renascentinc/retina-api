ALTER TABLE public."transaction"
ADD FOREIGN KEY (to_user_id)
  REFERENCES public."user" (id)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

ALTER TABLE public."transaction"
ADD FOREIGN KEY (from_user_id)
  REFERENCES public."user" (id)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

ALTER TABLE public."transaction"
ADD FOREIGN KEY (to_location_id)
  REFERENCES public.location (id)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

ALTER TABLE public."transaction"
ADD FOREIGN KEY (from_location_id)
  REFERENCES public.location (id)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

ALTER TABLE public."transaction"
ADD FOREIGN KEY (organization_id)
  REFERENCES public.organization (id)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;
