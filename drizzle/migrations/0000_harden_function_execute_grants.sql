-- Internal trigger functions should not be callable from the API
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_page_visit() FROM anon, authenticated;

-- Admin-only RPCs: keep callable by signed-in users (body enforces admin), block anonymous
REVOKE EXECUTE ON FUNCTION public.admin_soft_delete_user(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_restore_user(uuid) FROM anon;

-- Purchase completion stays server-side only
REVOKE EXECUTE ON FUNCTION public.complete_ebook_purchase(text, boolean) FROM anon, authenticated;

-- Ensure the public-facing blog view respects the caller's RLS
ALTER VIEW public.public_blog_posts SET (security_invoker = on);