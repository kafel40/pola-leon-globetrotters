-- Fix 1: Update owned_ebooks INSERT policy to only allow free ebooks (price = 0 or NULL)
-- This prevents users from claiming paid ebooks without payment verification
DROP POLICY IF EXISTS "Users can add ebooks to their library" ON public.owned_ebooks;

CREATE POLICY "Users can add free ebooks to their library" 
ON public.owned_ebooks 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.ebooks e
    WHERE e.id::text = ebook_id
    AND (e.price IS NULL OR e.price = 0)
    AND e.is_published = true
  )
);

-- Fix 2: Update storage policy to include 'audio' folder for owned ebooks
DROP POLICY IF EXISTS "Users can download owned ebook files" ON storage.objects;

CREATE POLICY "Users can download owned ebook files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'ebooks'
    AND (storage.foldername(name))[1] IN ('pdf', 'epub', 'audio')
    AND EXISTS (
      SELECT 1 FROM public.owned_ebooks oe
      WHERE oe.user_id = auth.uid()
      AND name LIKE '%' || oe.ebook_id || '%'
    )
  );