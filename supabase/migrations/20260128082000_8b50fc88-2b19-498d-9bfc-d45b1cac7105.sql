-- Add bg_color column to announcement_bar for admin customization
ALTER TABLE public.announcement_bar 
ADD COLUMN IF NOT EXISTS bg_color text DEFAULT '#7C3AED';

-- Create RLS policies for admin to read profiles (for admin panel)
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Allow admins to read newsletter_subscribers count
-- (already has policy for viewing all subscribers)