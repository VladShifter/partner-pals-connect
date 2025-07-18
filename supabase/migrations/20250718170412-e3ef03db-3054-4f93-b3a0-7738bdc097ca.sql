-- Add ROI calculator default fields to products table
ALTER TABLE public.products 
ADD COLUMN roi_default_deals_per_month integer DEFAULT 5,
ADD COLUMN roi_default_deal_value numeric DEFAULT 1000,
ADD COLUMN roi_monthly_fee numeric DEFAULT 99;