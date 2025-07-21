-- Critical Security Fix: Remove insecure development policies and implement proper RLS

-- Drop all insecure development policies
DROP POLICY IF EXISTS "Development admin access" ON public.vendors;
DROP POLICY IF EXISTS "Development partner access" ON public.partners;
DROP POLICY IF EXISTS "Development product access" ON public.products;
DROP POLICY IF EXISTS "Development application access" ON public.partnership_requests;
DROP POLICY IF EXISTS "Development tag access" ON public.tags;
DROP POLICY IF EXISTS "Development pricing tier access" ON public.product_pricing_tiers;

-- Create secure admin policies for vendors
CREATE POLICY "Admins can manage all vendors" ON public.vendors
  FOR ALL 
  USING (is_admin(auth.uid()));

CREATE POLICY "Vendors can view their own profile" ON public.vendors
  FOR ALL 
  USING (user_id = auth.uid());

-- Create secure admin policies for partners
CREATE POLICY "Admins can manage all partners" ON public.partners
  FOR ALL 
  USING (is_admin(auth.uid()));

CREATE POLICY "Partners can view their own profile" ON public.partners
  FOR ALL 
  USING (user_id = auth.uid());

-- Create secure policies for products
CREATE POLICY "Admins can manage all products" ON public.products
  FOR ALL 
  USING (is_admin(auth.uid()));

CREATE POLICY "Vendors can manage their own products" ON public.products
  FOR ALL 
  USING (vendor_id = auth.uid());

-- Create secure policies for partnership requests
CREATE POLICY "Admins can manage all partnership_requests" ON public.partnership_requests
  FOR ALL 
  USING (is_admin(auth.uid()));

CREATE POLICY "Partners can view their own applications" ON public.partnership_requests
  FOR SELECT 
  USING (partner_id = auth.uid());

-- Create secure policies for tags (admins only can modify)
CREATE POLICY "Admins can manage all tags" ON public.tags
  FOR ALL 
  USING (is_admin(auth.uid()));

-- Create secure policies for pricing tiers
CREATE POLICY "Admins can manage all pricing tiers" ON public.product_pricing_tiers
  FOR ALL 
  USING (is_admin(auth.uid()));

CREATE POLICY "Vendors can manage pricing tiers for their products" ON public.product_pricing_tiers
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE products.id = product_pricing_tiers.product_id 
      AND products.vendor_id = auth.uid()
    )
  );

-- Fix partner applications security - only admins and application owners
DROP POLICY IF EXISTS "Anyone can create partner applications" ON public.partner_applications;
DROP POLICY IF EXISTS "Anyone can update partner applications by email" ON public.partner_applications;
DROP POLICY IF EXISTS "Anyone can view partner applications" ON public.partner_applications;

-- Create secure policies for partner applications
CREATE POLICY "Authenticated users can create their own applications" ON public.partner_applications
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own applications" ON public.partner_applications
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their own applications" ON public.partner_applications
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all partner applications" ON public.partner_applications
  FOR ALL 
  USING (is_admin(auth.uid()));

-- Add user_id column to partner_applications if it doesn't exist and make it required
ALTER TABLE public.partner_applications 
ALTER COLUMN user_id SET NOT NULL;