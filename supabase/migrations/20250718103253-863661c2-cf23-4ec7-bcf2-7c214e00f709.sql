-- Insert pricing tiers for CloudCRM Pro
INSERT INTO public.product_pricing_tiers 
  (product_id, tier_name, monthly_fee, commission_rate, description, is_most_popular, tier_order)
VALUES 
  ('b1b2c3d4-1234-5678-9012-123456789001', 'Starter', 0, 20, 'Perfect for testing the waters with basic support and materials', false, 0),
  ('b1b2c3d4-1234-5678-9012-123456789001', 'Professional', 99, 25, 'Most popular choice with premium support and marketing assets', true, 1),
  ('b1b2c3d4-1234-5678-9012-123456789001', 'Enterprise', 290, 30, 'Maximum earning potential with white-label options and priority support', false, 2);

-- Insert pricing tiers for EcomBoost Suite
INSERT INTO public.product_pricing_tiers 
  (product_id, tier_name, monthly_fee, commission_rate, description, is_most_popular, tier_order)
VALUES 
  ('b1b2c3d4-1234-5678-9012-123456789002', 'Basic', 49, 18, 'Entry-level reseller package with basic features', false, 0),
  ('b1b2c3d4-1234-5678-9012-123456789002', 'Pro', 149, 23, 'Advanced features and higher commission rates', true, 1),
  ('b1b2c3d4-1234-5678-9012-123456789002', 'Elite', 399, 28, 'Premium tier with maximum earning potential', false, 2);

-- Insert pricing tiers for SecureFlow VPN  
INSERT INTO public.product_pricing_tiers 
  (product_id, tier_name, monthly_fee, commission_rate, description, is_most_popular, tier_order)
VALUES 
  ('b1b2c3d4-1234-5678-9012-123456789003', 'Starter', 29, 22, 'Basic reseller package for VPN services', false, 0),
  ('b1b2c3d4-1234-5678-9012-123456789003', 'Business', 89, 27, 'Business-focused package with enhanced support', true, 1),
  ('b1b2c3d4-1234-5678-9012-123456789003', 'Premium', 199, 32, 'Top-tier package with maximum commissions', false, 2);