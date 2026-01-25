-- Revoke public access to complete_ebook_purchase function
-- This function should ONLY be called by the service role (backend) after payment verification
-- Regular authenticated users should NOT be able to call this directly

REVOKE EXECUTE ON FUNCTION public.complete_ebook_purchase FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.complete_ebook_purchase FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.complete_ebook_purchase FROM anon;

-- Only service_role retains access (for edge functions to call after payment verification)
GRANT EXECUTE ON FUNCTION public.complete_ebook_purchase TO service_role;