
-- Add new fields to products table for better reseller information
ALTER TABLE public.products 
ADD COLUMN annual_income_potential NUMERIC,
ADD COLUMN average_deal_size NUMERIC,
ADD COLUMN setup_fee NUMERIC,
ADD COLUMN build_from_scratch_cost NUMERIC;

-- Add some sample data to existing products for demonstration
UPDATE public.products 
SET 
  annual_income_potential = 150000,
  average_deal_size = 5000,
  setup_fee = 990,
  build_from_scratch_cost = 80000
WHERE name = 'CloudCRM Pro';

UPDATE public.products 
SET 
  annual_income_potential = 200000,
  average_deal_size = 8000,
  setup_fee = 1500,
  build_from_scratch_cost = 120000
WHERE name = 'EcomBoost Suite';

UPDATE public.products 
SET 
  annual_income_potential = 100000,
  average_deal_size = 3000,
  setup_fee = 800,
  build_from_scratch_cost = 60000
WHERE name = 'SecureFlow VPN';
