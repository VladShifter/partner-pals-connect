
-- Расширение таблицы tags для поддержки категорий и типов фильтров
ALTER TABLE public.tags 
ADD COLUMN category TEXT,
ADD COLUMN filter_type TEXT DEFAULT 'checkbox',
ADD COLUMN sort_order INTEGER DEFAULT 0,
ADD COLUMN is_featured BOOLEAN DEFAULT false;

-- Обновление существующих тегов - перенос в категорию Industry
UPDATE public.tags 
SET category = 'Industry', is_featured = true, sort_order = 1
WHERE name IN ('AI SaaS', 'E-commerce', 'Marketing', 'Analytics', 'Productivity');

-- Создание всех предустановленных тегов по категориям

-- Industry (продолжение - добавляем новые)
INSERT INTO public.tags (name, color_hex, category, is_global, is_featured, sort_order) VALUES
('Retail', '#FF6B35', 'Industry', true, true, 6),
('HoReCa', '#FF8C42', 'Industry', true, true, 7),
('Healthcare', '#06D6A0', 'Industry', true, true, 8),
('Logistics', '#118AB2', 'Industry', true, true, 9),
('Manufacturing', '#073B4C', 'Industry', true, true, 10),
('EdTech', '#7209B7', 'Industry', true, true, 11),
('FinTech', '#F72585', 'Industry', true, true, 12),
('PropTech', '#4361EE', 'Industry', true, true, 13),
('Travel', '#4CC9F0', 'Industry', true, true, 14),
('Legal', '#7209B7', 'Industry', true, true, 15),
('Energy', '#FFB700', 'Industry', true, true, 16),
('GovTech', '#06FFA5', 'Industry', true, true, 17);

-- Use-Case/Department
INSERT INTO public.tags (name, color_hex, category, is_global, is_featured, sort_order) VALUES
('CRM', '#FF006E', 'Use-Case', true, false, 1),
('Marketing Automation', '#FB5607', 'Use-Case', true, false, 2),
('Predictive Analytics', '#FFBE0B', 'Use-Case', true, false, 3),
('LMS & Training', '#8338EC', 'Use-Case', true, false, 4),
('HR Tech', '#3A86FF', 'Use-Case', true, false, 5),
('Customer Support', '#06FFA5', 'Use-Case', true, false, 6),
('Finance Ops', '#FB8500', 'Use-Case', true, false, 7),
('Cybersecurity', '#DC2F02', 'Use-Case', true, false, 8),
('BI & Reporting', '#9D4EDD', 'Use-Case', true, false, 9);

-- Product Scale
INSERT INTO public.tags (name, color_hex, category, is_global, is_featured, sort_order) VALUES
('MicroSaaS', '#90E0EF', 'Product Scale', true, false, 1),
('SMB SaaS', '#00B4D8', 'Product Scale', true, false, 2),
('Enterprise', '#0077B6', 'Product Scale', true, false, 3);

-- Technology/Stack
INSERT INTO public.tags (name, color_hex, category, is_global, is_featured, sort_order) VALUES
('AI-Agent', '#FF006E', 'Technology', true, false, 1),
('AI-Analytics', '#FB5607', 'Technology', true, false, 2),
('No-Code', '#FFBE0B', 'Technology', true, false, 3),
('Low-Code', '#8338EC', 'Technology', true, false, 4),
('API-First', '#3A86FF', 'Technology', true, false, 5),
('Blockchain', '#06FFA5', 'Technology', true, false, 6),
('IoT', '#FB8500', 'Technology', true, false, 7),
('AR/VR', '#DC2F02', 'Technology', true, false, 8);

-- Business Model
INSERT INTO public.tags (name, color_hex, category, is_global, is_featured, sort_order) VALUES
('SaaS-Subscription', '#06D6A0', 'Business Model', true, true, 1),
('One-Time License', '#118AB2', 'Business Model', true, true, 2),
('Tokens/Credits', '#073B4C', 'Business Model', true, true, 3),
('Usage-Based', '#FFD60A', 'Business Model', true, true, 4),
('Freemium-Upsell', '#003566', 'Business Model', true, true, 5);

-- Partner Type
INSERT INTO public.tags (name, color_hex, category, is_global, is_featured, sort_order) VALUES
('Full White Label', '#7209B7', 'Partner Type', true, true, 1),
('Classic Reseller', '#F72585', 'Partner Type', true, true, 2),
('Affiliate', '#4361EE', 'Partner Type', true, true, 3),
('Agency', '#4CC9F0', 'Partner Type', true, true, 4),
('VAR', '#7209B7', 'Partner Type', true, true, 5),
('MSP', '#06FFA5', 'Partner Type', true, true, 6),
('Referral-Only', '#FFB700', 'Partner Type', true, true, 7),
('OEM', '#FF006E', 'Partner Type', true, true, 8),
('Ambassador', '#FB5607', 'Partner Type', true, true, 9),
('Advisor', '#FFBE0B', 'Partner Type', true, true, 10);

-- Vendor Support & Engagement
INSERT INTO public.tags (name, color_hex, category, is_global, is_featured, sort_order) VALUES
('Marketing Materials Provided', '#06D6A0', 'Vendor Support', true, true, 1),
('Vendor Demos Client', '#118AB2', 'Vendor Support', true, true, 2),
('Lead Nurturing Support', '#073B4C', 'Vendor Support', true, true, 3),
('Partner Training Provided', '#FFD60A', 'Vendor Support', true, true, 4),
('Dedicated Partner Manager', '#003566', 'Vendor Support', true, true, 5),
('Full Self-Service', '#7209B7', 'Vendor Support', true, true, 6),
('Hands-On Support', '#F72585', 'Vendor Support', true, true, 7);

-- Quality Indicators
INSERT INTO public.tags (name, color_hex, category, is_global, is_featured, sort_order) VALUES
('100% Refund', '#06D6A0', 'Quality', true, false, 1),
('Zero-Risk', '#118AB2', 'Quality', true, false, 2),
('Trial Available', '#073B4C', 'Quality', true, false, 3),
('New', '#FFD60A', 'Quality', true, false, 4),
('Trending', '#003566', 'Quality', true, false, 5),
('Best-Seller', '#7209B7', 'Quality', true, false, 6),
('Premium', '#F72585', 'Quality', true, false, 7);

-- Client Segment
INSERT INTO public.tags (name, color_hex, category, is_global, is_featured, sort_order) VALUES
('B2B', '#4361EE', 'Client Segment', true, false, 1),
('B2C', '#4CC9F0', 'Client Segment', true, false, 2),
('B2G', '#7209B7', 'Client Segment', true, false, 3);

-- Geography/Compliance
INSERT INTO public.tags (name, color_hex, category, is_global, is_featured, sort_order) VALUES
('Global (200+)', '#06FFA5', 'Geography', true, false, 1),
('EU-Only', '#FFB700', 'Geography', true, false, 2),
('US-Only', '#FF006E', 'Geography', true, false, 3),
('GDPR-Ready', '#FB5607', 'Geography', true, false, 4),
('HIPAA-Ready', '#FFBE0B', 'Geography', true, false, 5),
('ISO 27001', '#8338EC', 'Geography', true, false, 6);

-- Setup & Support
INSERT INTO public.tags (name, color_hex, category, is_global, is_featured, sort_order) VALUES
('White-Label OK', '#3A86FF', 'Setup', true, false, 1),
('No-Code Launch', '#06FFA5', 'Setup', true, false, 2),
('<24h Go-Live', '#FB8500', 'Setup', true, false, 3),
('Full-Service', '#DC2F02', 'Setup', true, false, 4),
('Self-Serve', '#9D4EDD', 'Setup', true, false, 5),
('Dedicated CSM', '#90E0EF', 'Setup', true, false, 6);

-- Hosting/Deployment
INSERT INTO public.tags (name, color_hex, category, is_global, is_featured, sort_order) VALUES
('Pure-SaaS', '#00B4D8', 'Hosting', true, false, 1),
('Hybrid', '#0077B6', 'Hosting', true, false, 2),
('On-Prem Option', '#023E8A', 'Hosting', true, false, 3);

-- Создание функций для автоматических тегов-диапазонов
CREATE OR REPLACE FUNCTION public.get_commission_range_tag(commission_rate NUMERIC)
RETURNS TEXT
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT CASE 
    WHEN commission_rate IS NULL THEN NULL
    WHEN commission_rate <= 10 THEN '0–10%'
    WHEN commission_rate <= 30 THEN '11–30%'
    WHEN commission_rate <= 50 THEN '31–50%'
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
    WHEN deal_size < 100 THEN '<$100'
    WHEN deal_size <= 999 THEN '$100–999'
    WHEN deal_size <= 4999 THEN '$1,000–4,999'
    WHEN deal_size <= 19999 THEN '$5,000–19,999'
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
    WHEN annual_income/12 < 1000 THEN '<$1,000'
    WHEN annual_income/12 <= 4999 THEN '$1,000–4,999'
    WHEN annual_income/12 <= 19999 THEN '$5,000–19,999'
    WHEN annual_income/12 <= 99999 THEN '$20,000–99,999'
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
    WHEN setup_fee <= 499 THEN '$1–499'
    WHEN setup_fee <= 999 THEN '$500–999'
    ELSE '$1,000+'
  END;
$$;
