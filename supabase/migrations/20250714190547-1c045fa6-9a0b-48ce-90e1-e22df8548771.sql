-- Insert the three vendors from marketplace with proper UUIDs
INSERT INTO public.vendors (id, user_id, company_name, website, niche, pitch, status, created_at, updated_at) VALUES 
  (
    'a1b2c3d4-1234-5678-9012-123456789001'::uuid,
    'a1b2c3d4-1234-5678-9012-123456789011'::uuid,
    'TechFlow Solutions', 
    'https://techflow.com',
    'SaaS',
    'All-in-one CRM solution for growing businesses with advanced automation and analytics.',
    'approved',
    now(),
    now()
  ),
  (
    'a1b2c3d4-1234-5678-9012-123456789002'::uuid,
    'a1b2c3d4-1234-5678-9012-123456789012'::uuid,
    'Digital Commerce Inc',
    'https://digitalcommerce.com',
    'E-commerce', 
    'Complete e-commerce optimization platform with AI-powered recommendations and conversion tools.',
    'approved',
    now(),
    now()
  ),
  (
    'a1b2c3d4-1234-5678-9012-123456789003'::uuid,
    'a1b2c3d4-1234-5678-9012-123456789013'::uuid, 
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
    'b1b2c3d4-1234-5678-9012-123456789001'::uuid,
    'a1b2c3d4-1234-5678-9012-123456789001'::uuid,
    'CloudCRM Pro',
    'All-in-one CRM solution for growing businesses with advanced automation and analytics.',
    299.00,
    25.0,
    'approved',
    now(),
    now()
  ),
  (
    'b1b2c3d4-1234-5678-9012-123456789002'::uuid,
    'a1b2c3d4-1234-5678-9012-123456789002'::uuid,
    'EcomBoost Suite', 
    'Complete e-commerce optimization platform with AI-powered recommendations and conversion tools.',
    199.00,
    20.0,
    'approved',
    now(),
    now()
  ),
  (
    'b1b2c3d4-1234-5678-9012-123456789003'::uuid,
    'a1b2c3d4-1234-5678-9012-123456789003'::uuid,
    'SecureFlow VPN',
    'Enterprise-grade VPN solution with advanced threat protection and zero-trust architecture.',
    49.00,
    30.0,
    'pending',
    now(),
    now()
  );