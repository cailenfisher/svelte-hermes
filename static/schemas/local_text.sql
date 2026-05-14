CREATE TABLE public.local_text (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  scoped_content_id bigint,
  locale bigint NOT NULL,
  content text NOT NULL,
  link bigint NOT NULL,
  CONSTRAINT local_text_pkey PRIMARY KEY (id),
  CONSTRAINT local_text_locale_fkey FOREIGN KEY (locale) REFERENCES public.locale(id),
  CONSTRAINT local_text_link_fkey FOREIGN KEY (link) REFERENCES public.local_text_link(id)
);
