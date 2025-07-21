-- Fix RLS policies for product_tags table to allow proper product saving
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can manage all product_tags" ON public.product_tags;
DROP POLICY IF EXISTS "Anyone can view product tags" ON public.product_tags;

-- Create new policies that allow vendors to manage tags for their products
CREATE POLICY "Admins can manage all product_tags" ON public.product_tags
  FOR ALL 
  USING (is_admin(auth.uid()));

CREATE POLICY "Vendors can manage tags for their products" ON public.product_tags
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE products.id = product_tags.product_id 
      AND products.vendor_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view product tags" ON public.product_tags
  FOR SELECT 
  USING (true);