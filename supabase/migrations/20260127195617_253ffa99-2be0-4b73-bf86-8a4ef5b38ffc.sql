-- Add new columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS newsletter_consent boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS marketing_consent boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS terms_accepted_at timestamp with time zone;

-- Create announcement_bar table for admin messages
CREATE TABLE IF NOT EXISTS public.announcement_bar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on announcement_bar
ALTER TABLE public.announcement_bar ENABLE ROW LEVEL SECURITY;

-- Anyone can read active announcements
CREATE POLICY "Anyone can view active announcements"
ON public.announcement_bar
FOR SELECT
USING (is_active = true);

-- Only admins can manage announcements
CREATE POLICY "Admins can insert announcements"
ON public.announcement_bar
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update announcements"
ON public.announcement_bar
FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete announcements"
ON public.announcement_bar
FOR DELETE
USING (is_admin(auth.uid()));

-- Create newsletter_subscribers table for non-logged users
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Enable RLS on newsletter_subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (insert their email)
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
WITH CHECK (true);

-- Only admins can view/manage subscribers
CREATE POLICY "Admins can view all subscribers"
ON public.newsletter_subscribers
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update subscribers"
ON public.newsletter_subscribers
FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete subscribers"
ON public.newsletter_subscribers
FOR DELETE
USING (is_admin(auth.uid()));