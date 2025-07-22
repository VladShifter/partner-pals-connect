-- Update SaaS-subscription to SaaS in Business Model category
UPDATE public.tags 
SET name = 'SaaS' 
WHERE category = 'Business Model' AND name = 'SaaS-subscription';

-- Delete freemium upsell from Business Model category
DELETE FROM public.tags 
WHERE category = 'Business Model' AND name = 'freemium upsell';

-- Update referral only to referral in Partner Type category
UPDATE public.tags 
SET name = 'referral' 
WHERE category = 'Partner Type' AND name = 'referral only';

-- Delete unwanted Partner Type options (keeping only: полный уайт лейбл, классический реселлеинг, аффилиейт, реферал, эдвайзор, амбассадор)
DELETE FROM public.tags 
WHERE category = 'Partner Type' 
AND name NOT IN ('полный уайт лейбл', 'классический реселлеинг', 'аффилиейт', 'referral', 'эдвайзор', 'амбассадор');