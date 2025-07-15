-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can upload editor images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their uploaded editor images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their uploaded editor images" ON storage.objects;

-- Create more permissive policies for development
CREATE POLICY "Development editor images upload" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'editor-images');

CREATE POLICY "Development editor images update" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'editor-images');

CREATE POLICY "Development editor images delete" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'editor-images');