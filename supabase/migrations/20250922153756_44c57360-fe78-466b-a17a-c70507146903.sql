-- Fix security issue: Team members table exposes email addresses publicly
-- Handle existing policies properly

-- Drop existing policies first
DROP POLICY IF EXISTS "Team members are viewable by everyone" ON public.team_members;
DROP POLICY IF EXISTS "Team members are viewable by authenticated users" ON public.team_members;

-- Create a new policy that restricts full team member access to authenticated users only
CREATE POLICY "Team members full access for authenticated users" 
ON public.team_members 
FOR SELECT 
TO authenticated
USING (true);

-- Create a security definer function for public access to non-sensitive team member data
-- This excludes email addresses from public view
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