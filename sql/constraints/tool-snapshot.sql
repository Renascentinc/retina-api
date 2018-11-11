ALTER TABLE public.tool_snapshot
ADD FOREIGN KEY (tool_id, organization_id)
REFERENCES public."tool" (id, organization_id)
	ON DELETE RESTRICT
	ON UPDATE RESTRICT;

ALTER TABLE public.tool_snapshot
ADD FOREIGN KEY (owner_id, organization_id)
REFERENCES public."tool_owner_id" (id, organization_id)
	ON DELETE RESTRICT
	ON UPDATE RESTRICT;

ALTER TABLE public.tool_snapshot
ADD FOREIGN KEY (type_id, organization_id)
REFERENCES public.configurable_item (id, organization_id)
	ON DELETE RESTRICT
  ON UPDATE RESTRICT;

ALTER TABLE public.tool_snapshot
ADD FOREIGN KEY (brand_id, organization_id)
REFERENCES public.configurable_item (id, organization_id)
	ON DELETE RESTRICT
  ON UPDATE RESTRICT;

ALTER TABLE public.tool_snapshot
ADD FOREIGN KEY (purchased_from_id, organization_id)
REFERENCES public.configurable_item (id, organization_id)
	ON DELETE RESTRICT
  ON UPDATE RESTRICT;

ALTER TABLE public.tool_snapshot
ADD FOREIGN KEY (organization_id)
REFERENCES public.organization (id)
	ON DELETE RESTRICT
  ON UPDATE RESTRICT;

------------------ Metadata Constraints ----------------------

ALTER TABLE public.tool_snapshot
ADD FOREIGN KEY (actor_id, organization_id)
REFERENCES public."user_id" (id, organization_id)
	ON DELETE RESTRICT
	ON UPDATE RESTRICT;
