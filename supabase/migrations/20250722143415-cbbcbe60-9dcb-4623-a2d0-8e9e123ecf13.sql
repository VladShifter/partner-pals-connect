-- Clear existing tags and recreate with proper structure
TRUNCATE TABLE public.tags RESTART IDENTITY CASCADE;

-- Insert Business Model tags
INSERT INTO public.tags (name, category, color_hex, sort_order, is_global, filter_type) VALUES
('SaaS Subscription', 'Business Model', '#06D6A0', 1, true, 'checkbox'),
('One-Time License', 'Business Model', '#118AB2', 2, true, 'checkbox'),
('Tokens / Credits', 'Business Model', '#073B4C', 3, true, 'checkbox'),
('Usage-Based', 'Business Model', '#FFD60A', 4, true, 'checkbox'),
('Other', 'Business Model', '#777777', 5, true, 'checkbox');

-- Insert Client Segment tags
INSERT INTO public.tags (name, category, color_hex, sort_order, is_global, filter_type) VALUES
('B2B', 'Client Segment', '#4361EE', 1, true, 'checkbox'),
('B2C', 'Client Segment', '#F72585', 2, true, 'checkbox'),
('B2B2C', 'Client Segment', '#7209B7', 3, true, 'checkbox'),
('B2G', 'Client Segment', '#003566', 4, true, 'checkbox');

-- Insert Industry tags
INSERT INTO public.tags (name, category, color_hex, sort_order, is_global, filter_type) VALUES
('AI SaaS', 'Industry', '#7E3AF2', 1, true, 'checkbox'),
('Retail', 'Industry', '#FF6B35', 2, true, 'checkbox'),
('HoReCa', 'Industry', '#FF8C42', 3, true, 'checkbox'),
('Healthcare', 'Industry', '#06D6A0', 4, true, 'checkbox'),
('Logistics', 'Industry', '#118AB2', 5, true, 'checkbox'),
('Manufacturing', 'Industry', '#073B4C', 6, true, 'checkbox'),
('EdTech', 'Industry', '#7209B7', 7, true, 'checkbox'),
('FinTech', 'Industry', '#F72585', 8, true, 'checkbox'),
('PropTech', 'Industry', '#4361EE', 9, true, 'checkbox'),
('Travel', 'Industry', '#4CC9F0', 10, true, 'checkbox'),
('Legal', 'Industry', '#7209B7', 11, true, 'checkbox'),
('Energy', 'Industry', '#FFB700', 12, true, 'checkbox'),
('GovTech', 'Industry', '#06FFA5', 13, true, 'checkbox'),
('Analytics', 'Industry', '#2563EB', 14, true, 'checkbox'),
('Productivity', 'Industry', '#CA8A04', 15, true, 'checkbox'),
('Marketing', 'Industry', '#DC2626', 16, true, 'checkbox'),
('Other', 'Industry', '#777777', 17, true, 'checkbox');

-- Insert Partnership Types tags
INSERT INTO public.tags (name, category, color_hex, sort_order, is_global, filter_type) VALUES
('White-Label Reseller', 'Partnership Types', '#E63946', 1, true, 'checkbox'),
('Classic Reseller', 'Partnership Types', '#F77F00', 2, true, 'checkbox'),
('Affiliate', 'Partnership Types', '#FFBE0B', 3, true, 'checkbox'),
('Referral', 'Partnership Types', '#8338EC', 4, true, 'checkbox'),
('Advisor', 'Partnership Types', '#3A86FF', 5, true, 'checkbox'),
('Other', 'Partnership Types', '#777777', 6, true, 'checkbox');

-- Insert Monthly Earning ranges
INSERT INTO public.tags (name, category, color_hex, sort_order, is_global, filter_type) VALUES
('$1k+', 'Monthly Earning', '#90E0EF', 1, true, 'checkbox'),
('$5k+', 'Monthly Earning', '#00B4D8', 2, true, 'checkbox'),
('$10k+', 'Monthly Earning', '#0077B6', 3, true, 'checkbox'),
('$30k+', 'Monthly Earning', '#023E8A', 4, true, 'checkbox'),
('$50k+', 'Monthly Earning', '#03045E', 5, true, 'checkbox');

-- Insert Geography / Compliance tags
INSERT INTO public.tags (name, category, color_hex, sort_order, is_global, filter_type) VALUES
('Europe (EU)', 'Geography', '#06FFA5', 1, true, 'checkbox'),
('North America', 'Geography', '#4361EE', 2, true, 'checkbox'),
('South America', 'Geography', '#F72585', 3, true, 'checkbox'),
('Middle East', 'Geography', '#FFB700', 4, true, 'checkbox'),
('Africa', 'Geography', '#8338EC', 5, true, 'checkbox'),
('Asia-Pacific (APAC)', 'Geography', '#06D6A0', 6, true, 'checkbox'),
('Southeast Asia', 'Geography', '#FF8C42', 7, true, 'checkbox'),
('Central Asia', 'Geography', '#7209B7', 8, true, 'checkbox'),
('Other', 'Geography', '#777777', 9, true, 'checkbox');

-- Insert Hosting / Deployment tags
INSERT INTO public.tags (name, category, color_hex, sort_order, is_global, filter_type) VALUES
('Pure SaaS', 'Hosting', '#00B4D8', 1, true, 'checkbox'),
('Hybrid', 'Hosting', '#0077B6', 2, true, 'checkbox'),
('On-Prem Option', 'Hosting', '#023E8A', 3, true, 'checkbox');

-- Insert Product Scale tags
INSERT INTO public.tags (name, category, color_hex, sort_order, is_global, filter_type) VALUES
('MicroSaaS', 'Product Scale', '#90E0EF', 1, true, 'checkbox'),
('SMB SaaS', 'Product Scale', '#00B4D8', 2, true, 'checkbox'),
('Enterprise', 'Product Scale', '#0077B6', 3, true, 'checkbox'),
('Other', 'Product Scale', '#777777', 4, true, 'checkbox');

-- Insert Quality tags
INSERT INTO public.tags (name, category, color_hex, sort_order, is_global, filter_type) VALUES
('New', 'Quality', '#06FFA5', 1, true, 'checkbox'),
('Trending', 'Quality', '#FFB700', 2, true, 'checkbox'),
('Best-Seller', 'Quality', '#F72585', 3, true, 'checkbox'),
('Premium', 'Quality', '#7209B7', 4, true, 'checkbox');

-- Insert Setup Fee ranges
INSERT INTO public.tags (name, category, color_hex, sort_order, is_global, filter_type) VALUES
('$0', 'Setup Fee', '#06FFA5', 1, true, 'checkbox'),
('$1-499', 'Setup Fee', '#FFB700', 2, true, 'checkbox'),
('$500-999', 'Setup Fee', '#FF8C42', 3, true, 'checkbox'),
('$1,000+', 'Setup Fee', '#E63946', 4, true, 'checkbox');

-- Insert Technology / Stack tags
INSERT INTO public.tags (name, category, color_hex, sort_order, is_global, filter_type) VALUES
('AI Powered', 'Technology', '#9333ea', 1, true, 'checkbox'),
('AI Agent', 'Technology', '#FF006E', 2, true, 'checkbox'),
('AI Analytics', 'Technology', '#FB5607', 3, true, 'checkbox'),
('Low-Code', 'Technology', '#8338EC', 4, true, 'checkbox'),
('API-First', 'Technology', '#3A86FF', 5, true, 'checkbox'),
('Blockchain', 'Technology', '#FFB700', 6, true, 'checkbox'),
('IoT', 'Technology', '#06D6A0', 7, true, 'checkbox'),
('AR / VR', 'Technology', '#F72585', 8, true, 'checkbox');

-- Insert Use-Case / Department tags
INSERT INTO public.tags (name, category, color_hex, sort_order, is_global, filter_type) VALUES
('CRM', 'Use-Case', '#FF006E', 1, true, 'checkbox'),
('Marketing Automation', 'Use-Case', '#FB5607', 2, true, 'checkbox'),
('Predictive Analytics', 'Use-Case', '#FFBE0B', 3, true, 'checkbox'),
('LMS & Training', 'Use-Case', '#8338EC', 4, true, 'checkbox'),
('HR Tech', 'Use-Case', '#3A86FF', 5, true, 'checkbox'),
('Customer Support', 'Use-Case', '#06FFA5', 6, true, 'checkbox'),
('Finance Ops', 'Use-Case', '#FB8500', 7, true, 'checkbox'),
('Cybersecurity', 'Use-Case', '#DC2F02', 8, true, 'checkbox'),
('BI & Reporting', 'Use-Case', '#9D4EDD', 9, true, 'checkbox'),
('Other', 'Use-Case', '#777777', 10, true, 'checkbox');

-- Insert Vendor Support / Setup tags
INSERT INTO public.tags (name, category, color_hex, sort_order, is_global, filter_type) VALUES
('White-Label', 'Vendor Support', '#3A86FF', 1, true, 'checkbox'),
('No-Code Launch', 'Vendor Support', '#06FFA5', 2, true, 'checkbox'),
('<24h Go-Live', 'Vendor Support', '#FFB700', 3, true, 'checkbox'),
('Full-Service', 'Vendor Support', '#DC2F02', 4, true, 'checkbox'),
('Self-Serve', 'Vendor Support', '#777777', 5, true, 'checkbox'),
('Dedicated CSM', 'Vendor Support', '#003566', 6, true, 'checkbox'),
('100% Refund', 'Vendor Support', '#06D6A0', 7, true, 'checkbox'),
('Zero-Risk', 'Vendor Support', '#7209B7', 8, true, 'checkbox'),
('Trial Available', 'Vendor Support', '#073B4C', 9, true, 'checkbox');

-- Insert Commission % ranges
INSERT INTO public.tags (name, category, color_hex, sort_order, is_global, filter_type) VALUES
('0-10%', 'Commission', '#90E0EF', 1, true, 'checkbox'),
('11-30%', 'Commission', '#00B4D8', 2, true, 'checkbox'),
('31-50%', 'Commission', '#0077B6', 3, true, 'checkbox'),
('50%+', 'Commission', '#023E8A', 4, true, 'checkbox');

-- Insert Average Deal Size ranges
INSERT INTO public.tags (name, category, color_hex, sort_order, is_global, filter_type) VALUES
('< $100', 'Average Deal Size', '#90E0EF', 1, true, 'checkbox'),
('$100-999', 'Average Deal Size', '#00B4D8', 2, true, 'checkbox'),
('$1,000-4,999', 'Average Deal Size', '#0077B6', 3, true, 'checkbox'),
('$5,000-19,999', 'Average Deal Size', '#023E8A', 4, true, 'checkbox'),
('$20,000+', 'Average Deal Size', '#03045E', 5, true, 'checkbox');

-- Insert Potential Monthly Income ranges
INSERT INTO public.tags (name, category, color_hex, sort_order, is_global, filter_type) VALUES
('< $1,000', 'Potential Monthly Income', '#90E0EF', 1, true, 'checkbox'),
('$1,000-4,999', 'Potential Monthly Income', '#00B4D8', 2, true, 'checkbox'),
('$5,000-19,999', 'Potential Monthly Income', '#0077B6', 3, true, 'checkbox'),
('$20,000-99,999', 'Potential Monthly Income', '#023E8A', 4, true, 'checkbox'),
('$100,000+', 'Potential Monthly Income', '#03045E', 5, true, 'checkbox');

-- Insert Legal & Security tags
INSERT INTO public.tags (name, category, color_hex, sort_order, is_global, filter_type) VALUES
('GDPR Ready', 'Legal & Security', '#06FFA5', 1, true, 'checkbox'),
('ISO 27001', 'Legal & Security', '#4361EE', 2, true, 'checkbox'),
('SOC 2', 'Legal & Security', '#7209B7', 3, true, 'checkbox'),
('HIPAA Compliant', 'Legal & Security', '#06D6A0', 4, true, 'checkbox'),
('CCPA Compliant', 'Legal & Security', '#3A86FF', 5, true, 'checkbox'),
('End-to-end Encryption', 'Legal & Security', '#DC2F02', 6, true, 'checkbox'),
('PCI DSS', 'Legal & Security', '#E63946', 7, true, 'checkbox'),
('Data stored in EU', 'Legal & Security', '#118AB2', 8, true, 'checkbox'),
('Data stored in US', 'Legal & Security', '#073B4C', 9, true, 'checkbox');

-- Update slugs for all new tags
UPDATE public.tags SET slug = generate_tag_slug(name) WHERE slug IS NULL;