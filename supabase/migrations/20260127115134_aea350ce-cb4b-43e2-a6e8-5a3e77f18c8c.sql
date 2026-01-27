-- Fix 1: Add explicit DENY policies for user_roles table
-- Prevent any INSERT, UPDATE, DELETE operations by regular users (only service_role can modify)
CREATE POLICY "Deny all inserts on user_roles" 
ON public.user_roles 
FOR INSERT 
TO authenticated
WITH CHECK (false);

CREATE POLICY "Deny all updates on user_roles" 
ON public.user_roles 
FOR UPDATE 
TO authenticated
USING (false);

CREATE POLICY "Deny all deletes on user_roles" 
ON public.user_roles 
FOR DELETE 
TO authenticated
USING (false);

-- Fix 2: Add explicit DENY policy for owned_ebooks DELETE
-- Purchases should be permanent - only service_role should be able to remove
CREATE POLICY "Deny all deletes on owned_ebooks" 
ON public.owned_ebooks 
FOR DELETE 
TO authenticated
USING (false);

-- Fix 3: Update storage policy to use exact path matching instead of LIKE pattern
DROP POLICY IF EXISTS "Users can download owned ebook files" ON storage.objects;

CREATE POLICY "Users can download owned ebook files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'ebooks'
    AND (storage.foldername(name))[1] IN ('pdf', 'epub', 'audio')
    AND EXISTS (
      SELECT 1 FROM public.ebooks e
      JOIN public.owned_ebooks oe ON e.id::text = oe.ebook_id
      WHERE oe.user_id = auth.uid()
      AND (
        name = REPLACE(e.pdf_url, 'https://geumdwcqrftgsdpmicty.supabase.co/storage/v1/object/public/ebooks/', '')
        OR name = REPLACE(e.epub_url, 'https://geumdwcqrftgsdpmicty.supabase.co/storage/v1/object/public/ebooks/', '')
        OR name = REPLACE(e.audio_url, 'https://geumdwcqrftgsdpmicty.supabase.co/storage/v1/object/public/ebooks/', '')
        OR name = e.pdf_url
        OR name = e.epub_url
        OR name = e.audio_url
      )
    )
  );