-- Add extended_description field to products table
ALTER TABLE public.products 
ADD COLUMN extended_description TEXT;