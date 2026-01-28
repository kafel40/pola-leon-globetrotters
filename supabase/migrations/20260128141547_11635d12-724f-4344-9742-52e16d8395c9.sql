-- Add status and confirmation_token columns for Double Opt-In
ALTER TABLE public.newsletter_subscribers 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed')),
ADD COLUMN IF NOT EXISTS confirmation_token UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_confirmation_token ON public.newsletter_subscribers(confirmation_token);

-- Update existing subscribers to confirmed status (they already subscribed before double opt-in)
UPDATE public.newsletter_subscribers SET status = 'confirmed', confirmed_at = subscribed_at WHERE status = 'pending' AND is_active = true;