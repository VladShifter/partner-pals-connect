-- Insert the three vendors from marketplace
INSERT INTO public.vendors (id, user_id, company_name, website, niche, pitch, status, created_at, updated_at) VALUES 
  (
    gen_random_uuid(),
    'vendor-techflow-user',
    'TechFlow Solutions', 
    'https://techflow.com',
    'SaaS',
    'All-in-one CRM solution for growing businesses with advanced automation and analytics.',
    'approved',
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'vendor-digitalcommerce-user',
    'Digital Commerce Inc',
    'https://digitalcommerce.com',
    'E-commerce', 
    'Complete e-commerce optimization platform with AI-powered recommendations and conversion tools.',
    'approved',
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'vendor-cybershield-user', 
    'CyberShield Corp',
    'https://cybershield.com',
    'Cybersecurity',
    'Enterprise-grade VPN solution with advanced threat protection and zero-trust architecture.',
    'pending',
    now(),
    now()
  );

-- Insert products for these vendors
INSERT INTO public.products (id, vendor_id, name, description, price, commission_rate, status, created_at, updated_at) VALUES 
  (
    gen_random_uuid(),
    (SELECT id FROM public.vendors WHERE company_name = 'TechFlow Solutions'),
    'CloudCRM Pro',
    'All-in-one CRM solution for growing businesses with advanced automation and analytics.',
    299.00,
    25.0,
    'approved',
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM public.vendors WHERE company_name = 'Digital Commerce Inc'),
    'EcomBoost Suite', 
    'Complete e-commerce optimization platform with AI-powered recommendations and conversion tools.',
    199.00,
    20.0,
    'approved',
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM public.vendors WHERE company_name = 'CyberShield Corp'),
    'SecureFlow VPN',
    'Enterprise-grade VPN solution with advanced threat protection and zero-trust architecture.',
    49.00,
    30.0,
    'pending',
    now(),
    now()
  );