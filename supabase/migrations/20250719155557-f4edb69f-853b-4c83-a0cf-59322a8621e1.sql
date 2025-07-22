-- Insert Partner Type tags
INSERT INTO public.tags (name, category, color_hex, is_global, is_featured, sort_order) VALUES
('полный уайт лейбл', 'Partner Type', '#E63946', true, true, 1),
('классический реселлеинг', 'Partner Type', '#F77F00', true, true, 2),
('аффилиейт', 'Partner Type', '#FCBF49', true, true, 3),
('referral', 'Partner Type', '#003566', true, true, 4),
('эдвайзор', 'Partner Type', '#0077B6', true, true, 5),
('амбассадор', 'Partner Type', '#023E8A', true, true, 6);

-- Verify Business Model updates worked
SELECT * FROM tags WHERE category = 'Business Model' ORDER BY name;