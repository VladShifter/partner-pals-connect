-- Add additional fields to partner_applications table
ALTER TABLE public.partner_applications ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE public.partner_applications ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.partner_applications ADD COLUMN IF NOT EXISTS business_model TEXT;
ALTER TABLE public.partner_applications ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.partner_applications ADD COLUMN IF NOT EXISTS active_marketing_channels TEXT;
ALTER TABLE public.partner_applications ADD COLUMN IF NOT EXISTS audience_size TEXT;
ALTER TABLE public.partner_applications ADD COLUMN IF NOT EXISTS social_profiles TEXT;
ALTER TABLE public.partner_applications ADD COLUMN IF NOT EXISTS partner_roles TEXT[];
ALTER TABLE public.partner_applications ADD COLUMN IF NOT EXISTS user_id UUID;