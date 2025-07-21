-- Fix RLS policies for product_tags table
DROP POLICY IF EXISTS "Vendors can manage tags for their products" ON public.product_tags;

-- Create new policy that allows vendors to manage tags for their products
CREATE POLICY "Vendors can manage tags for their products" ON public.product_tags
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE products.id = product_tags.product_id 
      AND products.vendor_id = auth.uid()
    )
  );