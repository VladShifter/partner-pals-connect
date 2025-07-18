
-- Create product pricing tiers table
CREATE TABLE public.product_pricing_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  tier_name TEXT NOT NULL,
  monthly_fee NUMERIC NOT NULL DEFAULT 0,
  commission_rate NUMERIC NOT NULL,
  description TEXT,
  tier_order INTEGER NOT NULL DEFAULT 0,
  is_most_popular BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.product_pricing_tiers ENABLE ROW LEVEL SECURITY;

-- Anyone can view pricing tiers for approved products
CREATE POLICY "Anyone can view pricing tiers for approved products" 
  ON public.product_pricing_tiers 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE products.id = product_pricing_tiers.product_id 
      AND products.status = 'approved'
    )
  );

-- Development access for all operations
CREATE POLICY "Development pricing tier access" 
  ON public.product_pricing_tiers 
  FOR ALL 
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_product_pricing_tiers_updated_at
  BEFORE UPDATE ON public.product_pricing_tiers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Create index for better performance
CREATE INDEX idx_product_pricing_tiers_product_id ON public.product_pricing_tiers(product_id);
CREATE INDEX idx_product_pricing_tiers_order ON public.product_pricing_tiers(product_id, tier_order);
