-- Fix Business Model tags
UPDATE public.tags 
SET name = 'SaaS' 
WHERE category = 'Business Model' AND name = 'SaaS-Subscription';

DELETE FROM public.tags 
WHERE category = 'Business Model' AND name = 'Freemium-Upsell';

-- Check what Partner Type tags exist
SELECT * FROM tags WHERE category ILIKE '%partner%';

-- Also check with exact case
SELECT * FROM tags WHERE category = 'Partner Type';