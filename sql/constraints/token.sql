ALTER TABLE public.token
ADD FOREIGN KEY (user_id)
REFERENCES public."user" (id)
	ON DELETE RESTRICT
	ON UPDATE RESTRICT;

ALTER TABLE public.token
ADD FOREIGN KEY (organization_id)
REFERENCES public.organization (id)
	ON DELETE RESTRICT
  ON UPDATE RESTRICT;