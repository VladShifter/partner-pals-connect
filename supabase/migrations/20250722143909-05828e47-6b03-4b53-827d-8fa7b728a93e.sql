-- Восстановим теги для существующих продуктов на основе их характеристик

-- AI-Powered Training Platform (EdTech, AI, B2B)
INSERT INTO product_tags (product_id, tag_id)
SELECT 'ca0cd0df-fbb5-4d10-83f2-3c26570c4e18', id 
FROM tags 
WHERE name IN ('EdTech', 'AI Powered', 'B2B', 'SaaS Subscription', 'LMS & Training', 'White-Label Reseller', 'Europe (EU)', 'Pure SaaS', 'SMB SaaS', 'Trial Available', '11-30%', '$1,000-4,999', '$5,000-19,999');

-- SecureFlow VPN (Cybersecurity, Enterprise, B2B)  
INSERT INTO product_tags (product_id, tag_id)
SELECT 'b1b2c3d4-1234-5678-9012-123456789003', id 
FROM tags 
WHERE name IN ('Cybersecurity', 'B2B', 'One-Time License', 'Enterprise', 'Classic Reseller', 'North America', 'Pure SaaS', 'Trial Available', '31-50%', '$1,000-4,999', '$5,000-19,999', 'End-to-end Encryption');

-- EcomBoost Suite (E-commerce, Analytics, B2B)
INSERT INTO product_tags (product_id, tag_id)
SELECT 'b1b2c3d4-1234-5678-9012-123456789002', id 
FROM tags 
WHERE name IN ('Retail', 'Marketing Automation', 'Predictive Analytics', 'B2B', 'SaaS Subscription', 'Classic Reseller', 'North America', 'Pure SaaS', 'SMB SaaS', 'Trial Available', '11-30%', '$5,000-19,999', '$20,000-99,999');

-- CloudCRM Pro (CRM, SaaS, B2B)
INSERT INTO product_tags (product_id, tag_id)
SELECT 'b1b2c3d4-1234-5678-9012-123456789001', id 
FROM tags 
WHERE name IN ('CRM', 'B2B', 'SaaS Subscription', 'Classic Reseller', 'North America', 'Pure SaaS', 'SMB SaaS', 'Trial Available', '31-50%', '$1,000-4,999', '$20,000-99,999');