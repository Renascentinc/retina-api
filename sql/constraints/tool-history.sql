ALTER TABLE public.tool_history
ADD FOREIGN KEY (id, organization_id)
REFERENCES public."tool" (id, organization_id)
	ON DELETE RESTRICT
	ON UPDATE RESTRICT;

ALTER TABLE public.tool_history
ADD FOREIGN KEY (owner_id, organization_id)
REFERENCES public."tool_owner_id" (id, organization_id)
	ON DELETE RESTRICT
	ON UPDATE RESTRICT;

ALTER TABLE public.tool_history
ADD FOREIGN KEY (type_id, organization_id)
REFERENCES public.configurable_item (id, organization_id)
	ON DELETE RESTRICT
  ON UPDATE RESTRICT;

ALTER TABLE public.tool_history
ADD FOREIGN KEY (brand_id, organization_id)
REFERENCES public.configurable_item (id, organization_id)
	ON DELETE RESTRICT
  ON UPDATE RESTRICT;

ALTER TABLE public.tool_history
ADD FOREIGN KEY (purchased_from_id, organization_id)
REFERENCES public.configurable_item (id, organization_id)
	ON DELETE RESTRICT
  ON UPDATE RESTRICT;

ALTER TABLE public.tool_history
ADD FOREIGN KEY (organization_id)
REFERENCES public.organization (id)
	ON DELETE RESTRICT
  ON UPDATE RESTRICT;
