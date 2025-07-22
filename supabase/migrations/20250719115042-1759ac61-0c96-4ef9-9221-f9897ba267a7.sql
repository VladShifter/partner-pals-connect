-- Add category and slug columns to tags table
ALTER TABLE public.tags 
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique composite index on (category, slug)
CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_category_slug ON public.tags (category, slug);

-- Create function to generate slug from name
CREATE OR REPLACE FUNCTION public.generate_tag_slug(input_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(trim(input_name), '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    )
  );
END;
$$;

-- Create trigger to automatically populate slug on insert
CREATE OR REPLACE FUNCTION public.populate_tag_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug = generate_tag_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_populate_tag_slug
  BEFORE INSERT ON public.tags
  FOR EACH ROW
  EXECUTE FUNCTION populate_tag_slug();

-- Insert all predefined tags with explicit slugs
INSERT INTO public.tags (category, name, slug)
VALUES 
-- Industry
('industry', 'AI SaaS', 'ai-saas'),
('industry', 'E-commerce', 'e-commerce'),
('industry', 'Marketing', 'marketing'),
('industry', 'Analytics', 'analytics'),
('industry', 'Productivity', 'productivity'),
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
('industry', 'Other', 'other-industry'),

-- Use-Case
('use_case', 'CRM', 'crm'),
('use_case', 'Marketing Automation', 'marketing-automation'),
('use_case', 'Predictive Analytics', 'predictive-analytics'),
('use_case', 'LMS & Training', 'lms-training'),
('use_case', 'HR Tech', 'hr-tech'),
('use_case', 'Customer Support', 'customer-support'),
('use_case', 'Finance Ops', 'finance-ops'),
('use_case', 'Cybersecurity', 'cybersecurity'),
('use_case', 'BI & Reporting', 'bi-reporting'),
('use_case', 'Other', 'other-use-case'),

-- Product Scale
('product_scale', 'MicroSaaS', 'microsaas'),
('product_scale', 'SMB SaaS', 'smb-saas'),
('product_scale', 'Enterprise', 'enterprise'),
('product_scale', 'Other', 'other-product-scale'),

-- Technology
('technology', 'AI-Agent', 'ai-agent'),
('technology', 'AI-Analytics', 'ai-analytics'),
('technology', 'No-Code', 'no-code'),
('technology', 'Low-Code', 'low-code'),
('technology', 'API-First', 'api-first'),
('technology', 'Blockchain', 'blockchain'),
('technology', 'IoT', 'iot'),
('technology', 'AR/VR', 'ar-vr'),
('technology', 'Other', 'other-technology'),

-- Business Model
('business_model', 'SaaS Subscription', 'saas-subscription'),
('business_model', 'One-Time License', 'one-time-license'),
('business_model', 'Tokens/Credits', 'tokens-credits'),
('business_model', 'Usage-Based', 'usage-based'),
('business_model', 'Freemium Upsell', 'freemium-upsell'),
('business_model', 'Other', 'other-business-model'),

-- Partner Type
('partner_type', 'Full White Label', 'full-white-label'),
('partner_type', 'Classic Reseller', 'classic-reseller'),
('partner_type', 'Affiliate', 'affiliate'),
('partner_type', 'Agency', 'agency'),
('partner_type', 'VAR', 'var'),
('partner_type', 'MSP', 'msp'),
('partner_type', 'Referral-Only', 'referral-only'),
('partner_type', 'OEM', 'oem'),
('partner_type', 'Ambassador', 'ambassador'),
('partner_type', 'Advisor', 'advisor'),
('partner_type', 'Other', 'other-partner-type'),

-- Vendor Support
('vendor_support', 'Marketing Materials Provided', 'marketing-materials-provided'),
('vendor_support', 'Vendor Demos Client', 'vendor-demos-client'),
('vendor_support', 'Lead Nurturing Support', 'lead-nurturing-support'),
('vendor_support', 'Partner Training Provided', 'partner-training-provided'),
('vendor_support', 'Dedicated Partner Manager', 'dedicated-partner-manager'),
('vendor_support', 'Other', 'other-vendor-support'),

-- Setup Fee
('setup_fee', '$0', '0'),
('setup_fee', '$1-499', '1-499'),
('setup_fee', '$500-999', '500-999'),
('setup_fee', '$1,000+', '1000-plus'),

-- Vendor Support Setup
('vendor_support_setup', 'White-Label OK', 'white-label-ok'),
('vendor_support_setup', 'No-Code Launch', 'no-code-launch'),
('vendor_support_setup', 'Full-Service', 'full-service'),
('vendor_support_setup', 'Self-Serve', 'self-serve'),
('vendor_support_setup', 'Dedicated CSM', 'dedicated-csm'),
('vendor_support_setup', '100% Refund', '100-percent-refund'),
('vendor_support_setup', 'Zero-Risk', 'zero-risk'),
('vendor_support_setup', 'Trial Available', 'trial-available'),

-- Commission %
('commission_percent', '0-10%', '0-10-percent'),
('commission_percent', '11-30%', '11-30-percent'),
('commission_percent', '31-50%', '31-50-percent'),
('commission_percent', '50%+', '50-plus-percent'),

-- Average Deal Size
('average_deal_size', '< $100', 'lt-100'),
('average_deal_size', '$100-999', '100-999'),
('average_deal_size', '$1,000-4,999', '1000-4999'),
('average_deal_size', '$5,000-19,999', '5000-19999'),
('average_deal_size', '$20,000+', '20000-plus'),

-- Potential Monthly Income
('potential_monthly_income', '< $1,000', 'lt-1000'),
('potential_monthly_income', '$1,000-4,999', '1000-4999'),
('potential_monthly_income', '$5,000-19,999', '5000-19999'),
('potential_monthly_income', '$20,000-99,999', '20000-99999'),
('potential_monthly_income', '$100,000+', '100000-plus'),

-- Legal & Security
('legal_security', 'GDPR Ready', 'gdpr-ready'),
('legal_security', 'ISO 27001', 'iso-27001'),
('legal_security', 'SOC 2', 'soc-2'),
('legal_security', 'HIPAA Compliant', 'hipaa-compliant'),
('legal_security', 'CCPA Compliant', 'ccpa-compliant'),
('legal_security', 'End-to-End Encryption', 'e2e-encryption'),
('legal_security', 'PCI DSS', 'pci-dss'),
('legal_security', 'Data stored in EU', 'data-in-eu'),
('legal_security', 'Data stored in US', 'data-in-us')

ON CONFLICT (category, slug) DO NOTHING;

-- Create functions for automatic range tags
CREATE OR REPLACE FUNCTION public.get_commission_range_tag(commission_rate NUMERIC)
RETURNS TEXT
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT CASE 
    WHEN commission_rate IS NULL THEN NULL
    WHEN commission_rate <= 10 THEN '0-10%'
    WHEN commission_rate <= 30 THEN '11-30%'
    WHEN commission_rate <= 50 THEN '31-50%'
    ELSE '50%+'
  END;
$$;

CREATE OR REPLACE FUNCTION public.get_deal_size_range_tag(deal_size NUMERIC)
RETURNS TEXT
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT CASE 
    WHEN deal_size IS NULL THEN NULL
    WHEN deal_size < 100 THEN '< $100'
    WHEN deal_size <= 999 THEN '$100-999'
    WHEN deal_size <= 4999 THEN '$1,000-4,999'
    WHEN deal_size <= 19999 THEN '$5,000-19,999'
    ELSE '$20,000+'
  END;
$$;

CREATE OR REPLACE FUNCTION public.get_monthly_income_range_tag(annual_income NUMERIC)
RETURNS TEXT
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT CASE 
    WHEN annual_income IS NULL THEN NULL
    WHEN annual_income/12 < 1000 THEN '< $1,000'
    WHEN annual_income/12 <= 4999 THEN '$1,000-4,999'
    WHEN annual_income/12 <= 19999 THEN '$5,000-19,999'
    WHEN annual_income/12 <= 99999 THEN '$20,000-99,999'
    ELSE '$100,000+'
  END;
$$;

CREATE OR REPLACE FUNCTION public.get_setup_fee_range_tag(setup_fee NUMERIC)
RETURNS TEXT
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT CASE 
    WHEN setup_fee IS NULL OR setup_fee = 0 THEN '$0'
    WHEN setup_fee <= 499 THEN '$1-499'
    WHEN setup_fee <= 999 THEN '$500-999'
    ELSE '$1,000+'
  END;
$$;