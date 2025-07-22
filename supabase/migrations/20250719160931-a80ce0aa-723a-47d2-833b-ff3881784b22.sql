-- Add AI-powered tag to Technology category
INSERT INTO public.tags (name, category, color_hex, is_global, is_featured, sort_order)
VALUES ('AI-powered', 'Technology', '#9333ea', true, true, 1)
ON CONFLICT (name, category) DO NOTHING;