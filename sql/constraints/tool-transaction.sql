ALTER TABLE public."tool_transaction"
ADD FOREIGN KEY (transaction_id)
  REFERENCES public."transaction" (id)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

ALTER TABLE public."tool_transaction"
ADD FOREIGN KEY (tool_id)
  REFERENCES public.tool (id)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;
