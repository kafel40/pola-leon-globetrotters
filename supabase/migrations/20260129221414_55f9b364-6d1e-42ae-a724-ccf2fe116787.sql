-- Add coloring_page_url column to ebooks table for downloadable coloring pages
ALTER TABLE public.ebooks 
ADD COLUMN coloring_page_url text;

-- Add comment for documentation
COMMENT ON COLUMN public.ebooks.coloring_page_url IS 'URL to PDF or image file containing coloring page for this ebook';

-- Create contact_messages table for contact form submissions
CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  newsletter_consent boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public contact form)
CREATE POLICY "Anyone can submit contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Only admins can read contact messages
CREATE POLICY "Admins can view contact messages" 
ON public.contact_messages 
FOR SELECT 
USING (public.is_admin(auth.uid()));