-- PUBLIC still has EXECUTE on these functions; revoke it and rely on explicit role grants
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.validate_page_visit() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.complete_ebook_purchase(text, boolean) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.admin_soft_delete_user(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.admin_restore_user(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_soft_delete_user(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_restore_user(uuid) TO authenticated;

-- Keep RLS helper and public RPCs working through explicit role grants only
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO anon, authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.validate_voucher(text, uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_voucher(text, uuid, uuid) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.confirm_newsletter_subscription(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.confirm_newsletter_subscription(uuid) TO anon, authenticated, service_role;