CREATE TABLE public.local_text_link (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  slug text NOT NULL,
  title text NOT NULL,
  scope text,
  CONSTRAINT local_text_link_pkey PRIMARY KEY (id)
);
