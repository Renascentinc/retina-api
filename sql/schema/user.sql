BEGIN;

CREATE TABLE IF NOT EXISTS public.user (
	id   				 		serial,
	first_name			str_t						 NOT NULL,
	last_name				str_t						 NOT NULL,
	email						str_t						 NOT NULL,
	phone_number		short_str_t			 NOT NULL,
	password				str_t						 NOT NULL,
	role				 		role				     NOT NULL,
	status			 		user_status      NOT NULL,
	organization_id id_t             NOT NULL,
  PRIMARY KEY (id, organization_id),
  CONSTRAINT user_unique_email UNIQUE (email, organization_id)
);

CREATE UNIQUE INDEX ON public.user (id);

COMMIT;
