-- Add slug column to products table
ALTER TABLE public.products 
ADD COLUMN slug text;

-- Create unique index on slug for better performance and uniqueness
CREATE UNIQUE INDEX idx_products_slug ON public.products(slug);

-- Function to generate slug from product name
CREATE OR REPLACE FUNCTION public.generate_slug(input_text text)
RETURNS text
LANGUAGE plpgsql
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

-- Update existing products with generated slugs
UPDATE public.products 
SET slug = generate_slug(name) 
WHERE slug IS NULL;

-- Make slug NOT NULL after populating existing records
ALTER TABLE public.products 
ALTER COLUMN slug SET NOT NULL;