-- Drop existing policies on newsletter_subscribers
DROP POLICY IF EXISTS "Admins can update subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can delete subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can view all subscribers" ON public.newsletter_subscribers;

-- Create new restrictive policies
-- Only INSERT allowed for anon (to subscribe)
CREATE POLICY "Anon can only insert subscriptions"
ON public.newsletter_subscribers
FOR INSERT
TO anon
WITH CHECK (true);

-- Deny all SELECT for anon and authenticated (tokens must never be exposed)
CREATE POLICY "Deny select for anon"
ON public.newsletter_subscribers
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Deny select for authenticated"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (false);

-- Admins can view (via is_admin function which uses service_role context)
CREATE POLICY "Admins can view subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- Admins can update
CREATE POLICY "Admins can update subscribers"
ON public.newsletter_subscribers
FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()));

-- Admins can delete
CREATE POLICY "Admins can delete subscribers"
ON public.newsletter_subscribers
FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));

-- Create secure RPC function for newsletter confirmation
-- This function runs with SECURITY DEFINER so it bypasses RLS
CREATE OR REPLACE FUNCTION public.confirm_newsletter_subscription(_token uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _subscriber_id uuid;
  _subscriber_email text;
  _subscriber_status text;
BEGIN
  -- Find subscriber by token
  SELECT id, email, status INTO _subscriber_id, _subscriber_email, _subscriber_status
  FROM public.newsletter_subscribers
  WHERE confirmation_token = _token;

  -- Token not found
  IF _subscriber_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Nieprawidłowy lub wygasły link potwierdzający'
    );
  END IF;

  -- Already confirmed
  IF _subscriber_status = 'confirmed' THEN
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Subskrypcja została już wcześniej potwierdzona!'
    );
  END IF;

  -- Update to confirmed status
  UPDATE public.newsletter_subscribers
  SET 
    status = 'confirmed',
    is_active = true,
    confirmed_at = now(),
    confirmation_token = NULL  -- Clear token after use for extra security
  WHERE id = _subscriber_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Dziękujemy! Twoja subskrypcja została potwierdzona.',
    'email', _subscriber_email
  );
END;
$$;

-- Grant execute permission to anon role
GRANT EXECUTE ON FUNCTION public.confirm_newsletter_subscription(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.confirm_newsletter_subscription(uuid) TO authenticated;