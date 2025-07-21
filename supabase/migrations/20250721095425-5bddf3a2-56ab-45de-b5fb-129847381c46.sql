-- Critical Security Fix: Remove ALL existing policies and recreate secure ones

-- Drop ALL existing policies for all tables
DROP POLICY IF EXISTS "Development admin access" ON public.vendors;
DROP POLICY IF EXISTS "Development partner access" ON public.partners;
DROP POLICY IF EXISTS "Development product access" ON public.products;
DROP POLICY IF EXISTS "Development application access" ON public.partnership_requests;
DROP POLICY IF EXISTS "Development tag access" ON public.tags;
DROP POLICY IF EXISTS "Development pricing tier access" ON public.product_pricing_tiers;

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admins can manage all vendors" ON public.vendors;
DROP POLICY IF EXISTS "Admins can manage all partners" ON public.partners;
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage all partnership_requests" ON public.partnership_requests;
DROP POLICY IF EXISTS "Admins can manage all tags" ON public.tags;
DROP POLICY IF EXISTS "Admins can manage all partner applications" ON public.partner_applications;

-- Drop existing user policies
DROP POLICY IF EXISTS "Users can view their own vendor profile" ON public.vendors;
DROP POLICY IF EXISTS "Users can view their own partner profile" ON public.partners;
DROP POLICY IF EXISTS "Anyone can view approved vendors" ON public.vendors;
DROP POLICY IF EXISTS "Anyone can view approved products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view global tags" ON public.tags;
DROP POLICY IF EXISTS "Anyone can view pricing tiers for approved products" ON public.product_pricing_tiers;

-- Drop partner application policies
DROP POLICY IF EXISTS "Anyone can create partner applications" ON public.partner_applications;
DROP POLICY IF EXISTS "Anyone can update partner applications by email" ON public.partner_applications;
DROP POLICY IF EXISTS "Anyone can view partner applications" ON public.partner_applications;
DROP POLICY IF EXISTS "Authenticated users can create their own applications" ON public.partner_applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON public.partner_applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON public.partner_applications;

-- Now create secure policies

-- VENDORS: Admins manage all, users manage own, public can view approved
CREATE POLICY "Admins can manage all vendors" ON public.vendors
  FOR ALL 
  USING (is_admin(auth.uid()));

CREATE POLICY "Users can manage their own vendor profile" ON public.vendors
  FOR ALL 
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view approved vendors" ON public.vendors
  FOR SELECT 
  USING (status = 'approved');

-- PARTNERS: Admins manage all, users manage own
CREATE POLICY "Admins can manage all partners" ON public.partners
  FOR ALL 
  USING (is_admin(auth.uid()));

CREATE POLICY "Users can manage their own partner profile" ON public.partners
  FOR ALL 
  USING (user_id = auth.uid());

-- PRODUCTS: Admins manage all, vendors manage own, public can view approved
CREATE POLICY "Admins can manage all products" ON public.products
  FOR ALL 
  USING (is_admin(auth.uid()));

CREATE POLICY "Vendors can manage their own products" ON public.products
  FOR ALL 
  USING (vendor_id = auth.uid());

CREATE POLICY "Anyone can view approved products" ON public.products
  FOR SELECT 
  USING (status = 'approved');

-- PARTNERSHIP REQUESTS: Admins manage all, partners view own
CREATE POLICY "Admins can manage all partnership_requests" ON public.partnership_requests
  FOR ALL 
  USING (is_admin(auth.uid()));

CREATE POLICY "Partners can view their own applications" ON public.partnership_requests
  FOR SELECT 
  USING (partner_id = auth.uid());

-- TAGS: Admins manage all, everyone can view global tags
CREATE POLICY "Admins can manage all tags" ON public.tags
  FOR ALL 
  USING (is_admin(auth.uid()));

CREATE POLICY "Anyone can view global tags" ON public.tags
  FOR SELECT 
  USING (is_global = true);

-- PRICING TIERS: Admins manage all, vendors manage own, public view for approved products
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

CREATE POLICY "Anyone can view pricing tiers for approved products" ON public.product_pricing_tiers
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE products.id = product_pricing_tiers.product_id 
      AND products.status = 'approved'
    )
  );

-- PARTNER APPLICATIONS: Secure access only
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