-- 1. Add text_color column to announcement_bar
ALTER TABLE public.announcement_bar 
ADD COLUMN text_color text DEFAULT '#FFFFFF';

-- 2. Add is_deleted column to profiles for soft-delete
ALTER TABLE public.profiles 
ADD COLUMN is_deleted boolean DEFAULT false,
ADD COLUMN deleted_at timestamp with time zone DEFAULT NULL;

-- 3. Create page_visits table for analytics
CREATE TABLE public.page_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  page_path text NOT NULL,
  user_agent text,
  referrer text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create index for efficient querying by date
CREATE INDEX idx_page_visits_created_at ON public.page_visits(created_at DESC);
CREATE INDEX idx_page_visits_visitor_id ON public.page_visits(visitor_id);

-- Enable RLS on page_visits
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert page visits (for tracking)
CREATE POLICY "Anyone can insert page visits"
ON public.page_visits
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view page visits
CREATE POLICY "Admins can view page visits"
ON public.page_visits
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- 4. Create blog_categories table
CREATE TABLE public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
ON public.blog_categories
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert categories"
ON public.blog_categories
FOR INSERT
TO authenticated
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update categories"
ON public.blog_categories
FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete categories"
ON public.blog_categories
FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));

-- 5. Create blog_posts table
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  cover_image_url text,
  category_id uuid REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  tags text[] DEFAULT '{}',
  is_published boolean DEFAULT false,
  published_at timestamp with time zone,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  meta_title text,
  meta_description text,
  og_image_url text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_category_id ON public.blog_posts(category_id);
CREATE INDEX idx_blog_posts_tags ON public.blog_posts USING GIN(tags);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts"
ON public.blog_posts
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can view all posts"
ON public.blog_posts
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert posts"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update posts"
ON public.blog_posts
FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete posts"
ON public.blog_posts
FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));

-- Trigger for updating updated_at on blog_posts
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Create admin function to soft-delete users
CREATE OR REPLACE FUNCTION public.admin_soft_delete_user(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can delete users';
  END IF;
  
  -- Soft delete the profile
  UPDATE public.profiles
  SET is_deleted = true, deleted_at = now()
  WHERE user_id = _user_id;
  
  RETURN true;
END;
$$;

-- 7. Create admin function to restore users
CREATE OR REPLACE FUNCTION public.admin_restore_user(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can restore users';
  END IF;
  
  -- Restore the profile
  UPDATE public.profiles
  SET is_deleted = false, deleted_at = NULL
  WHERE user_id = _user_id;
  
  RETURN true;
END;
$$;