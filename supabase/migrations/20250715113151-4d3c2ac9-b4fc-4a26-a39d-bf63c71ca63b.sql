-- Add image upload fields to vendors table
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS preview_image_url TEXT;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS banner_image_url TEXT;

-- Update the function to handle tag management for vendors
CREATE OR REPLACE FUNCTION public.update_vendor_tags(vendor_id_param UUID, tag_ids UUID[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Remove existing tags for this vendor
  DELETE FROM public.vendor_tags WHERE vendor_id = vendor_id_param;
  
  -- Add new tags
  IF array_length(tag_ids, 1) > 0 THEN
    INSERT INTO public.vendor_tags (vendor_id, tag_id)
    SELECT vendor_id_param, unnest(tag_ids);
  END IF;
END;
$$;