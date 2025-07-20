-- Add missing fields to partner_applications table
ALTER TABLE partner_applications 
ADD COLUMN IF NOT EXISTS entity_type text DEFAULT 'individual',
ADD COLUMN IF NOT EXISTS individual_type text,
ADD COLUMN IF NOT EXISTS revenue_goals numeric,
ADD COLUMN IF NOT EXISTS company_description text;