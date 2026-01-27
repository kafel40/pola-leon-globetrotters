-- Make the ebooks bucket public so cover images can be displayed
UPDATE storage.buckets SET public = true WHERE id = 'ebooks';

-- Create policy for public read access to covers folder only
CREATE POLICY "Public can view cover images"
ON storage.objects FOR SELECT
USING (bucket_id = 'ebooks' AND (storage.foldername(name))[1] = 'covers');