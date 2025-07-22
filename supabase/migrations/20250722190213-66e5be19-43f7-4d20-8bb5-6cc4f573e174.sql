-- Add quick_signup flag to profiles table
ALTER TABLE public.profiles 
ADD COLUMN quick_signup BOOLEAN DEFAULT FALSE;