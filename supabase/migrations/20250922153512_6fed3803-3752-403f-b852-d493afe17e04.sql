-- Fix security issue: Members table has ineffective RLS policies
-- The current SELECT policy compares auth.uid() to the 'id' column, but 'id' is a generated UUID, not the user's auth ID
-- This means the policy doesn't work and no one can actually view member data

-- First, let's add a proper user_id column that references auth.users
ALTER TABLE public.members 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update the RLS policies to use the new user_id column instead of the ineffective id comparison

-- Drop the existing ineffective SELECT policy
DROP POLICY IF EXISTS "Members can view their own profile" ON public.members;

-- Create a proper SELECT policy that allows users to view their own member profile
CREATE POLICY "Members can view their own profile" 
ON public.members 
FOR SELECT 
USING (auth.uid() = user_id);

-- Update the existing UPDATE policy to be more specific about user ownership
DROP POLICY IF EXISTS "Members are editable by authenticated users only" ON public.members;

CREATE POLICY "Members can update their own profile" 
ON public.members 
FOR UPDATE 
USING (auth.uid() = user_id);

-- The INSERT policy needs to be updated to ensure users can only create their own profile
DROP POLICY IF EXISTS "Anyone can create a member profile" ON public.members;

CREATE POLICY "Users can create their own member profile" 
ON public.members 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add a policy for authenticated users to view member names only (for directory purposes)
-- This allows viewing basic info like names but protects email addresses and other sensitive data
CREATE POLICY "Authenticated users can view member names" 
ON public.members 
FOR SELECT 
TO authenticated
USING (true);

-- However, to protect email addresses specifically, we need to be more restrictive
-- Let's remove the above policy and create a more secure one
DROP POLICY IF EXISTS "Authenticated users can view member names" ON public.members;

-- Only allow users to view their own complete profile
-- For any member directory functionality, it should be handled through a separate view or function
-- that only exposes non-sensitive information