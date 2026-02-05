-- Add constraints directly on the table as additional safety layer
ALTER TABLE public.page_visits 
  ADD CONSTRAINT check_visitor_id_format CHECK (visitor_id LIKE 'v_%' AND LENGTH(visitor_id) <= 100),
  ADD CONSTRAINT check_page_path_format CHECK (page_path LIKE '/%' AND LENGTH(page_path) <= 500),
  ADD CONSTRAINT check_user_agent_length CHECK (user_agent IS NULL OR LENGTH(user_agent) <= 512),
  ADD CONSTRAINT check_referrer_length CHECK (referrer IS NULL OR LENGTH(referrer) <= 512);

-- =============================================
-- CREATE PUBLIC_BLOG_POSTS VIEW (HIDE AUTHOR_ID)
-- =============================================

-- Create the secure view that hides author_id and exposes author_name
CREATE OR REPLACE VIEW public.public_blog_posts
WITH (security_invoker = on)
AS
SELECT 
  bp.id,
  bp.title,
  bp.slug,
  bp.excerpt,
  bp.content,
  bp.cover_image_url,
  bp.category_id,
  bp.tags,
  bp.published_at,
  bp.meta_title,
  bp.meta_description,
  bp.og_image_url,
  bp.is_published,
  bp.created_at,
  bp.updated_at,
  -- Join with profiles to get author name instead of exposing author_id
  COALESCE(p.display_name, p.full_name, 'Zespół Pola i Leon') AS author_name
FROM public.blog_posts bp
LEFT JOIN public.profiles p ON bp.author_id = p.user_id
WHERE bp.is_published = true;

-- Grant select permission on the view
GRANT SELECT ON public.public_blog_posts TO anon;
GRANT SELECT ON public.public_blog_posts TO authenticated;