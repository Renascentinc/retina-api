ALTER TABLE public.tool
ADD FOREIGN KEY (owner_id, organization_id)
REFERENCES public."tool_owner" (id, organization_id)
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
