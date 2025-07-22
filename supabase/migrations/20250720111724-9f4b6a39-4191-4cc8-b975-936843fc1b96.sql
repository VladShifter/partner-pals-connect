
-- Create a table for partner applications with step-by-step progress tracking
CREATE TABLE public.partner_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  company_name TEXT,
  phone TEXT,
  experience_years INTEGER,
  target_market TEXT,
  monthly_revenue NUMERIC,
  team_size INTEGER,
  marketing_channels TEXT[],
  partnership_goals TEXT[],
  previous_partnerships TEXT,
  why_interested TEXT,
  current_step INTEGER DEFAULT 1,
  completed_steps INTEGER[] DEFAULT ARRAY[1],
  product_id UUID REFERENCES public.products(id),
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create and update their own applications (using email as identifier since no auth yet)
CREATE POLICY "Anyone can create partner applications" 
  ON public.partner_applications 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update partner applications by email" 
  ON public.partner_applications 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can view partner applications" 
  ON public.partner_applications 
  FOR SELECT 
  USING (true);

-- Admins can view all applications
CREATE POLICY "Admins can manage all partner applications" 
  ON public.partner_applications 
  FOR ALL 
  USING (is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_partner_applications_updated_at
  BEFORE UPDATE ON public.partner_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
