-- Fix 1: Add explicit DENY policy for anonymous access to profiles table
-- This provides defense-in-depth against unauthenticated access attempts

CREATE POLICY "Deny anonymous access to profiles" 
ON public.profiles 
FOR SELECT 
TO anon
USING (false);

CREATE POLICY "Deny anonymous insert to profiles" 
ON public.profiles 
FOR INSERT 
TO anon
WITH CHECK (false);

CREATE POLICY "Deny anonymous update to profiles" 
ON public.profiles 
FOR UPDATE 
TO anon
USING (false);

CREATE POLICY "Deny anonymous delete to profiles" 
ON public.profiles 
FOR DELETE 
TO anon
USING (false);