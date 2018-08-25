BEGIN;

CREATE TABLE IF NOT EXISTS public.tool_transaction (
	transaction_id 	id_t 				NOT NULL,
	tool_id 				id_t 				NOT NULL,
	to_status 			status_type NOT NULL,
	from_status 		status_type,
	PRIMARY KEY 		(transaction_id, tool_id)
);

COMMIT;
