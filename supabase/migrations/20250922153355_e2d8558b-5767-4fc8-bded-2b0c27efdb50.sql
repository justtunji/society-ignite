-- Fix security issue: Restrict contact submissions viewing to admin users only
-- Currently any authenticated user can view all contact form submissions

-- First, drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Contact submissions are viewable by authenticated users only" ON public.contact_submissions;

-- Create a more secure policy that only allows service role access
-- This effectively restricts viewing to backend operations and admin dashboard access
CREATE POLICY "Contact submissions are viewable by service role only" 
ON public.contact_submissions 
FOR SELECT 
USING (auth.role() = 'service_role'::text);

-- Keep the existing INSERT policy as it's correct - anyone can submit contact forms
-- The INSERT policy "Anyone can create contact submissions" remains unchanged

-- Add UPDATE and DELETE policies for admin management (service role only)
CREATE POLICY "Contact submissions are updatable by service role only" 
ON public.contact_submissions 
FOR UPDATE 
USING (auth.role() = 'service_role'::text);

CREATE POLICY "Contact submissions are deletable by service role only" 
ON public.contact_submissions 
FOR DELETE 
USING (auth.role() = 'service_role'::text);