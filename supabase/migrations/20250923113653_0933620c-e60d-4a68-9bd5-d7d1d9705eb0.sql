-- Fix the previous migration error by using correct DROP commands
-- Remove the problematic view/function from before
DROP FUNCTION IF EXISTS public.get_public_team_members();

-- Use DROP TABLE instead of DROP VIEW since it was created as a table-like object
-- First check if team_members_public already exists and drop it properly
DROP TABLE IF EXISTS public.team_members_public CASCADE;

-- Now create the secure public table for team member information (without emails)
CREATE TABLE public.team_members_public (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    team_member_id uuid REFERENCES public.team_members(id) ON DELETE CASCADE,
    name text NOT NULL,
    title text,
    bio text,
    image_url text,
    linkedin_url text,
    twitter_url text,
    order_index integer DEFAULT 0,
    is_featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on the new public table
ALTER TABLE public.team_members_public ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view public team member information (no email addresses)
CREATE POLICY "Public team member info is viewable by everyone" 
ON public.team_members_public 
FOR SELECT 
USING (true);

-- Only authenticated users can manage the public information
CREATE POLICY "Public team member info is editable by authenticated users only" 
ON public.team_members_public 
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create a simple function to get public team members (without security definer)
-- This is a safer approach than the previous security definer function
CREATE OR REPLACE FUNCTION public.get_public_team_members()
RETURNS SETOF public.team_members_public
LANGUAGE sql
STABLE
AS $$
    SELECT * FROM public.team_members_public 
    ORDER BY order_index ASC, name ASC;
$$;