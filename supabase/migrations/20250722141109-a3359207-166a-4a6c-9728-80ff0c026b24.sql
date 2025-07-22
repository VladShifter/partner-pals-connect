-- Drop unique constraint on name to allow same names in different categories
ALTER TABLE public.tags DROP CONSTRAINT IF EXISTS tags_name_key;

-- Update tags table to add category and slug columns
ALTER TABLE public.tags 
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create function to generate slug from name
CREATE OR REPLACE FUNCTION public.generate_tag_slug(input_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(trim(input_text), '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    )
  );
END;
$$;

-- Create trigger to auto-generate slug
CREATE OR REPLACE FUNCTION public.set_tag_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = generate_tag_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_set_tag_slug ON public.tags;
CREATE TRIGGER trigger_set_tag_slug
  BEFORE INSERT OR UPDATE ON public.tags
  FOR EACH ROW
  EXECUTE FUNCTION set_tag_slug();

-- Create unique index for (category, slug)
CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_category_slug 
ON public.tags(category, slug);

-- Insert predefined tags
INSERT INTO public.tags (category, name, slug) VALUES
-- Business Model
('business_model', 'SaaS Subscription', 'saas-subscription'),
('business_model', 'One-Time Licence', 'one-time-licence'),
('business_model', 'Tokens / Credits', 'tokens-credits'),
('business_model', 'Usage-Based', 'usage-based'),
('business_model', 'Other', 'other'),

-- Client Segment
('client_segment', 'B2B', 'b2b'),
('client_segment', 'B2C', 'b2c'),
('client_segment', 'B2B2C', 'b2b2c'),
('client_segment', 'B2G', 'b2g'),

-- Industry
('industry', 'AI SaaS', 'ai-saas'),
('industry', 'Retail', 'retail'),
('industry', 'HoReCa', 'horeca'),
('industry', 'Healthcare', 'healthcare'),
('industry', 'Logistics', 'logistics'),
('industry', 'Manufacturing', 'manufacturing'),
('industry', 'EdTech', 'edtech'),
('industry', 'FinTech', 'fintech'),
('industry', 'PropTech', 'proptech'),
('industry', 'Travel', 'travel'),
('industry', 'Legal', 'legal'),
('industry', 'Energy', 'energy'),
('industry', 'GovTech', 'govtech'),
('industry', 'Analytics', 'analytics'),
('industry', 'Productivity', 'productivity'),
('industry', 'Marketing', 'marketing'),
('industry', 'Other', 'other'),

-- Partnership Types
('partnership_types', 'White-Label Reseller', 'white-label-reseller'),
('partnership_types', 'Classic Reseller', 'classic-reseller'),
('partnership_types', 'Affiliate', 'affiliate'),
('partnership_types', 'Referral', 'referral'),
('partnership_types', 'Advisor', 'advisor'),
('partnership_types', 'Other', 'other'),

-- Monthly Earning
('monthly_earning', '$1k+', '1k-plus'),
('monthly_earning', '$5k+', '5k-plus'),
('monthly_earning', '$10k+', '10k-plus'),
('monthly_earning', '$30k+', '30k-plus'),
('monthly_earning', '$50k+', '50k-plus'),

-- Geography / Compliance
('geography_compliance', 'Europe (EU)', 'europe-eu'),
('geography_compliance', 'North America', 'north-america'),
('geography_compliance', 'South America', 'south-america'),
('geography_compliance', 'Middle East', 'middle-east'),
('geography_compliance', 'Africa', 'africa'),
('geography_compliance', 'Asia-Pacific (APAC)', 'asia-pacific-apac'),
('geography_compliance', 'Southeast Asia', 'southeast-asia'),
('geography_compliance', 'Central Asia', 'central-asia'),
('geography_compliance', 'Other', 'other'),

-- Hosting / Deployment
('hosting_deployment', 'Pure SaaS', 'pure-saas'),
('hosting_deployment', 'Hybrid', 'hybrid'),
('hosting_deployment', 'On-Prem Option', 'on-prem-option'),

-- Product Scale
('product_scale', 'MicroSaaS', 'microsaas'),
('product_scale', 'SMB SaaS', 'smb-saas'),
('product_scale', 'Enterprise', 'enterprise'),
('product_scale', 'Other', 'other'),

-- Quality
('quality', 'New', 'new'),
('quality', 'Trending', 'trending'),
('quality', 'Best-Seller', 'best-seller'),
('quality', 'Premium', 'premium'),

-- Setup Fee
('setup_fee', '$0', '0'),
('setup_fee', '$1-499', '1-499'),
('setup_fee', '$500-999', '500-999'),
('setup_fee', '$1 000+', '1000-plus'),

-- Technology / Stack
('technology_stack', 'AI Powered', 'ai-powered'),
('technology_stack', 'AI Agent', 'ai-agent'),
('technology_stack', 'AI Analytics', 'ai-analytics'),
('technology_stack', 'Low-Code', 'low-code'),
('technology_stack', 'API-First', 'api-first'),
('technology_stack', 'Blockchain', 'blockchain'),
('technology_stack', 'IoT', 'iot'),
('technology_stack', 'AR / VR', 'ar-vr'),

-- Use-Case / Department
('use_case_department', 'CRM', 'crm'),
('use_case_department', 'Marketing Automation', 'marketing-automation'),
('use_case_department', 'Predictive Analytics', 'predictive-analytics'),
('use_case_department', 'LMS & Training', 'lms-training'),
('use_case_department', 'HR Tech', 'hr-tech'),
('use_case_department', 'Customer Support', 'customer-support'),
('use_case_department', 'Finance Ops', 'finance-ops'),
('use_case_department', 'Cybersecurity', 'cybersecurity'),
('use_case_department', 'BI & Reporting', 'bi-reporting'),
('use_case_department', 'Other', 'other'),

-- Vendor Support / Setup
('vendor_support_setup', 'White-Label', 'white-label'),
('vendor_support_setup', 'No-Code Launch', 'no-code-launch'),
('vendor_support_setup', '<24h Go-Live', '24h-go-live'),
('vendor_support_setup', 'Full-Service', 'full-service'),
('vendor_support_setup', 'Self-Serve', 'self-serve'),
('vendor_support_setup', 'Dedicated CSM', 'dedicated-csm'),
('vendor_support_setup', '100 % Refund', '100-percent-refund'),
('vendor_support_setup', 'Zero-Risk', 'zero-risk'),
('vendor_support_setup', 'Trial Available', 'trial-available'),

-- Commission %
('commission_percent', '0-10%', '0-10-percent'),
('commission_percent', '11-30%', '11-30-percent'),
('commission_percent', '31-50%', '31-50-percent'),
('commission_percent', '50%+', '50-plus-percent'),

-- Average Deal Size
('average_deal_size', '< $100', 'under-100'),
('average_deal_size', '$100-999', '100-999'),
('average_deal_size', '$1 000-4 999', '1000-4999'),
('average_deal_size', '$5 000-19 999', '5000-19999'),
('average_deal_size', '$20 000+', '20000-plus'),

-- Potential Monthly Income
('potential_monthly_income', '< $1 000', 'under-1000'),
('potential_monthly_income', '$1 000-4 999', '1000-4999'),
('potential_monthly_income', '$5 000-19 999', '5000-19999'),
('potential_monthly_income', '$20 000-99 999', '20000-99999'),
('potential_monthly_income', '$100 000+', '100000-plus'),

-- Legal & Security
('legal_security', 'GDPR Ready', 'gdpr-ready'),
('legal_security', 'ISO 27001', 'iso-27001'),
('legal_security', 'SOC 2', 'soc-2'),
('legal_security', 'HIPAA Compliant', 'hipaa-compliant'),
('legal_security', 'CCPA Compliant', 'ccpa-compliant'),
('legal_security', 'End-to-end Encryption', 'end-to-end-encryption'),
('legal_security', 'PCI DSS', 'pci-dss'),
('legal_security', 'Data stored in EU', 'data-stored-in-eu'),
('legal_security', 'Data stored in US', 'data-stored-in-us')
ON CONFLICT (category, slug) DO NOTHING;