-- Fix security issue: Team members table exposes email addresses publicly
-- Currently anyone can view all team member data including email addresses

-- First, let's update the existing policy to restrict full access to authenticated users only
DROP POLICY IF EXISTS "Team members are viewable by everyone" ON public.team_members;

-- Create a new policy that allows authenticated users to view all team member details
CREATE POLICY "Team members are viewable by authenticated users" 
ON public.team_members 
FOR SELECT 
TO authenticated
USING (true);

-- Create a public view that excludes sensitive information like email addresses
-- This allows public display of team members without exposing contact information
CREATE OR REPLACE VIEW public.team_members_public AS
SELECT 
    id,
    name,
    title,
    bio,
    image_url,
    linkedin_url,
    twitter_url,
    order_index,
    is_featured,
    created_at,
    updated_at
FROM public.team_members;

-- Enable RLS on the view (though it inherits restrictions from the base table)
ALTER VIEW public.team_members_public SET (security_barrier = true);

-- Create a policy for the public view that allows everyone to see non-sensitive team member info
-- Note: This is handled by creating a security definer function since views inherit RLS from base tables
CREATE OR REPLACE FUNCTION public.get_public_team_members()
RETURNS TABLE(
    id uuid,
    name text,
    title text,
    bio text,
    image_url text,
    linkedin_url text,
    twitter_url text,
    order_index integer,
    is_featured boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        tm.id,
        tm.name,
        tm.title,
        tm.bio,
        tm.image_url,
        tm.linkedin_url,
        tm.twitter_url,
        tm.order_index,
        tm.is_featured,
        tm.created_at,
        tm.updated_at
    FROM public.team_members tm
    ORDER BY tm.order_index ASC, tm.name ASC;
$$;