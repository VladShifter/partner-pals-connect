-- Назначение тегов существующим продуктам

-- CloudCRM Pro - CRM система
INSERT INTO public.product_tags (product_id, tag_id)
SELECT 'b1b2c3d4-1234-5678-9012-123456789001', t.id 
FROM public.tags t 
WHERE t.name IN (
  'AI SaaS', 'CRM', 'SaaS-Subscription', 'Classic Reseller', 
  'Marketing Materials Provided', 'B2B', 'SMB SaaS'
);

-- EcomBoost Suite - E-commerce платформа  
INSERT INTO public.product_tags (product_id, tag_id)
SELECT 'b1b2c3d4-1234-5678-9012-123456789002', t.id 
FROM public.tags t 
WHERE t.name IN (
  'E-commerce', 'Marketing Automation', 'SaaS-Subscription', 'Full White Label',
  'Vendor Demos Client', 'B2B', 'Enterprise', 'AI-Analytics'
);

-- SecureFlow VPN - Кибербезопасность
INSERT INTO public.product_tags (product_id, tag_id)
SELECT 'b1b2c3d4-1234-5678-9012-123456789003', t.id 
FROM public.tags t 
WHERE t.name IN (
  'Cybersecurity', 'One-Time License', 'Affiliate', 
  'Partner Training Provided', 'B2B', 'Enterprise', 'Global (200+)'
);