-- Fix security warnings: set search_path for new functions
CREATE OR REPLACE FUNCTION public.generate_tag_slug(input_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(trim(input_text), '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    )
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.set_tag_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = generate_tag_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$;