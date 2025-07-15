-- Remove the empty product that was created accidentally
DELETE FROM public.products 
WHERE vendor_id = 'a1b2c3d4-1234-5678-9012-123456789002' 
AND name = '';