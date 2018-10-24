ALTER TABLE public.session
ADD FOREIGN KEY (user_id, organization_id)
  REFERENCES public."user_id" (id, organization_id)
	ON DELETE RESTRICT
	ON UPDATE RESTRICT;

ALTER TABLE public.session
ADD FOREIGN KEY (organization_id)
REFERENCES public.organization (id)
	ON DELETE RESTRICT
  ON UPDATE RESTRICT;
