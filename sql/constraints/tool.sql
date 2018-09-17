ALTER TABLE public.tool
ADD FOREIGN KEY (user_id, organization_id)
REFERENCES public."user" (id, organization_id)
	ON DELETE RESTRICT
	ON UPDATE RESTRICT;

ALTER TABLE public.tool
ADD FOREIGN KEY (location_id, organization_id)
REFERENCES public."location" (id, organization_id)
	ON DELETE RESTRICT
	ON UPDATE RESTRICT;

ALTER TABLE public.tool
ADD FOREIGN KEY (type_id, organization_id)
REFERENCES public.configurable_item (id, organization_id)
	ON DELETE RESTRICT
  ON UPDATE RESTRICT;

ALTER TABLE public.tool
ADD FOREIGN KEY (brand_id, organization_id)
REFERENCES public.configurable_item (id, organization_id)
	ON DELETE RESTRICT
  ON UPDATE RESTRICT;

ALTER TABLE public.tool
ADD FOREIGN KEY (purchased_from_id, organization_id)
REFERENCES public.configurable_item (id, organization_id)
	ON DELETE RESTRICT
  ON UPDATE RESTRICT;

ALTER TABLE public.tool
ADD FOREIGN KEY (organization_id)
REFERENCES public.organization (id)
	ON DELETE RESTRICT
  ON UPDATE RESTRICT;
