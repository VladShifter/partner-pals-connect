-- Temporarily disable RLS for vendors table for development
-- This allows the admin interface to work with temporary login

-- Drop the problematic policy
DROP POLICY IF EXISTS "Temp admin access to vendors" ON public.vendors;

-- Create a permissive policy for development
CREATE POLICY "Development admin access" ON public.vendors
  FOR ALL 
  USING (true);  -- Allow all access for now

-- Do the same for other admin tables
DROP POLICY IF EXISTS "Admins can manage all partners" ON public.partners;
CREATE POLICY "Development partner access" ON public.partners
  FOR ALL 
  USING (true);

DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
CREATE POLICY "Development product access" ON public.products
  FOR ALL 
  USING (true);

DROP POLICY IF EXISTS "Admins can manage all partnership_requests" ON public.partnership_requests;
CREATE POLICY "Development application access" ON public.partnership_requests
  FOR ALL 
  USING (true);

DROP POLICY IF EXISTS "Admins can manage all tags" ON public.tags;
CREATE POLICY "Development tag access" ON public.tags
  FOR ALL 
  USING (true);