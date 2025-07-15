-- Create storage bucket for rich text editor images
INSERT INTO storage.buckets (id, name, public) VALUES ('editor-images', 'editor-images', true);

-- Create policies for editor images
CREATE POLICY "Editor images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'editor-images');

CREATE POLICY "Authenticated users can upload editor images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'editor-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their uploaded editor images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'editor-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their uploaded editor images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'editor-images' AND auth.uid() IS NOT NULL);