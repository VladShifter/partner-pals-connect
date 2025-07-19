-- Add AI-powered tag to Technology category (if not exists)
INSERT INTO public.tags (name, category, color_hex, is_global, is_featured, sort_order)
SELECT 'AI-powered', 'Technology', '#9333ea', true, true, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.tags WHERE name = 'AI-powered' AND category = 'Technology'
);