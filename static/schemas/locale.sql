CREATE TABLE public.locale (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  code text NOT NULL,
  name text NOT NULL,
  native_name text NOT NULL,
  dir text,
  CONSTRAINT locale_pkey PRIMARY KEY (id)
);
