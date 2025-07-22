-- Update Partner Type tags to English
UPDATE public.tags SET name = 'white label' WHERE category = 'Partner Type' AND name = 'полный уайт лейбл';
UPDATE public.tags SET name = 'reseller' WHERE category = 'Partner Type' AND name = 'классический реселлеинг';
UPDATE public.tags SET name = 'affiliate' WHERE category = 'Partner Type' AND name = 'аффилиейт';
UPDATE public.tags SET name = 'advisor' WHERE category = 'Partner Type' AND name = 'эдвайзор';
UPDATE public.tags SET name = 'ambassador' WHERE category = 'Partner Type' AND name = 'амбассадор';

-- Verify the changes
SELECT * FROM tags WHERE category = 'Partner Type' ORDER BY sort_order;