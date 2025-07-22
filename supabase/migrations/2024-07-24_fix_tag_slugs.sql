
-- 2024-07-24: Fix tag slugs housekeeping
-- Purpose: Update existing tags without slugs and ensure proper indexing
-- This migration only handles slug generation, not product-tag linking

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

-- Update existing tags that don't have slugs
DO $$
DECLARE
  updated_count INTEGER := 0;
BEGIN
  -- Update tags without slugs
  UPDATE public.tags 
  SET slug = generate_tag_slug(name)
  WHERE slug IS NULL OR slug = '';
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  RAISE NOTICE 'Updated % tags with missing slugs', updated_count;
END;
$$;

-- Ensure unique index exists for (category, slug)
CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_category_slug 
ON public.tags(category, slug);

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Tag slugs housekeeping completed ✅';
  RAISE NOTICE 'Next step: Migrate old textual tags → product_tags (MR 3-B)';
END;
$$;

/*
TODO: Step 3-B - Real migration of old textual tags
This will be implemented in a separate migration file:

1. Analyze existing product_tags connections
2. Map old textual tags to new taxonomy via slug/name matching
3. Create new product_id → tag_id relationships
4. Count links_created / skipped
5. Log the migration process

Placeholder for future migration logic:
*/

-- STUB: Future product tag migration (Step 3-B)
-- This section will be moved to a separate migration file
DO $$
BEGIN
  RAISE NOTICE 'STUB: Product tag migration will be implemented in Step 3-B';
  -- Future logic will go here:
  -- 1. SELECT DISTINCT old textual tags from products/product_tags
  -- 2. Match against tags.slug or tags.name ILIKE
  -- 3. INSERT INTO product_tags(product_id, tag_id) ON CONFLICT DO NOTHING
  -- 4. Count and log results
END;
$$;
