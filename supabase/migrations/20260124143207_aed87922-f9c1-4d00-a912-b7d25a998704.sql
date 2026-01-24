-- Create ebooks table for storing fairy tales
CREATE TABLE public.ebooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  country_slug TEXT NOT NULL,
  description TEXT,
  age_group TEXT DEFAULT '2-6',
  cover_image_url TEXT,
  pdf_url TEXT,
  epub_url TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on ebooks
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;

-- Public can read published ebooks
CREATE POLICY "Anyone can view published ebooks"
  ON public.ebooks FOR SELECT
  USING (is_published = true);

-- Create admin role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- Admins can do everything with ebooks
CREATE POLICY "Admins can view all ebooks"
  ON public.ebooks FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert ebooks"
  ON public.ebooks FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update ebooks"
  ON public.ebooks FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete ebooks"
  ON public.ebooks FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_ebooks_updated_at
  BEFORE UPDATE ON public.ebooks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for ebook files
INSERT INTO storage.buckets (id, name, public) VALUES ('ebooks', 'ebooks', true);

-- Storage policies for ebook files
CREATE POLICY "Anyone can view ebook files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ebooks');

CREATE POLICY "Admins can upload ebook files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ebooks' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update ebook files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'ebooks' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete ebook files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'ebooks' AND public.is_admin(auth.uid()));