-- Create storage bucket for vendor videos
INSERT INTO storage.buckets (id, name, public) VALUES ('vendor-videos', 'vendor-videos', true);

-- Create policies for vendor video uploads
CREATE POLICY "Anyone can view vendor videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'vendor-videos');

CREATE POLICY "Admins can upload vendor videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'vendor-videos');

CREATE POLICY "Admins can update vendor videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'vendor-videos');

CREATE POLICY "Admins can delete vendor videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'vendor-videos');

-- Add field for uploaded video file
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS demo_video_file_url TEXT;