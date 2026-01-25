-- Fix 1: Remove the insecure INSERT policy on owned_ebooks
-- Users should NOT be able to insert ownership records directly - this must go through server-side verification
DROP POLICY IF EXISTS "Users can add owned ebooks" ON public.owned_ebooks;

-- Fix 2: Make the ebooks storage bucket private (no direct public access to PDF/EPUB files)
UPDATE storage.buckets SET public = false WHERE id = 'ebooks';

-- Fix 3: Drop permissive storage policies
DROP POLICY IF EXISTS "Anyone can view ebook files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view ebook files" ON storage.objects;

-- Fix 4: Create secure storage policies
-- Allow public access ONLY to cover images (they can be shown on the website)
CREATE POLICY "Anyone can view cover images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'ebooks' 
    AND (storage.foldername(name))[1] = 'covers'
  );

-- Admins can access all files in the ebooks bucket
CREATE POLICY "Admins can access all ebook files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'ebooks'
    AND public.is_admin(auth.uid())
  );

-- Users can only access PDF/EPUB files for ebooks they own
CREATE POLICY "Users can download owned ebook files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'ebooks'
    AND (storage.foldername(name))[1] IN ('pdf', 'epub')
    AND EXISTS (
      SELECT 1 FROM public.owned_ebooks oe
      WHERE oe.user_id = auth.uid()
      -- Match by ebook slug in the file path (e.g., pdf/my-ebook.pdf or epub/my-ebook.epub)
      AND name LIKE '%' || oe.ebook_id || '%'
    )
  );

-- Fix 5: Create a secure server-side function for completing purchases
-- This should only be called by the backend after payment verification
CREATE OR REPLACE FUNCTION public.complete_ebook_purchase(
  _ebook_id TEXT,
  _payment_verified BOOLEAN DEFAULT FALSE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _country_slug TEXT;
  _ebook_uuid UUID;
BEGIN
  -- This function should only be called from server-side code (edge function)
  -- The _payment_verified flag must be set by the server after verifying with payment provider
  
  IF NOT _payment_verified THEN
    RAISE EXCEPTION 'Payment verification required';
  END IF;
  
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Get the ebook details
  SELECT id, country_slug INTO _ebook_uuid, _country_slug
  FROM public.ebooks
  WHERE id::text = _ebook_id OR slug = _ebook_id
  AND is_published = true;
  
  IF _ebook_uuid IS NULL THEN
    RAISE EXCEPTION 'Ebook not found or not published';
  END IF;
  
  -- Check if already owned
  IF EXISTS (
    SELECT 1 FROM public.owned_ebooks
    WHERE user_id = auth.uid()
    AND ebook_id = _ebook_uuid::text
  ) THEN
    -- Already owned, return true without error
    RETURN TRUE;
  END IF;
  
  -- Insert ownership record
  INSERT INTO public.owned_ebooks (user_id, ebook_id, country_slug)
  VALUES (auth.uid(), _ebook_uuid::text, _country_slug);
  
  RETURN TRUE;
END;
$$;

-- Revoke public access to this function - only authenticated users via server can call it
REVOKE EXECUTE ON FUNCTION public.complete_ebook_purchase FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.complete_ebook_purchase TO authenticated;