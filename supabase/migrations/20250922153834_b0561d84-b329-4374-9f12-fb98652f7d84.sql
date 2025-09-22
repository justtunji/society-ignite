-- Fix the security definer issue by removing the view approach
-- Instead, we'll use a more secure approach with proper RLS policies

-- Remove the problematic security definer view
DROP VIEW IF EXISTS public.team_members_public;
DROP FUNCTION IF EXISTS public.get_public_team_members();

-- Instead, let's create a separate table for public team member information
-- This approach is more secure and follows best practices

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

-- Create a trigger to automatically sync public information when team_members is updated
CREATE OR REPLACE FUNCTION public.sync_team_member_public()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Handle INSERT
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.team_members_public (
            team_member_id, name, title, bio, image_url, 
            linkedin_url, twitter_url, order_index, is_featured
        ) VALUES (
            NEW.id, NEW.name, NEW.title, NEW.bio, NEW.image_url,
            NEW.linkedin_url, NEW.twitter_url, NEW.order_index, NEW.is_featured
        );
        RETURN NEW;
    END IF;
    
    -- Handle UPDATE
    IF TG_OP = 'UPDATE' THEN
        UPDATE public.team_members_public SET
            name = NEW.name,
            title = NEW.title,
            bio = NEW.bio,
            image_url = NEW.image_url,
            linkedin_url = NEW.linkedin_url,
            twitter_url = NEW.twitter_url,
            order_index = NEW.order_index,
            is_featured = NEW.is_featured,
            updated_at = now()
        WHERE team_member_id = NEW.id;
        RETURN NEW;
    END IF;
    
    -- Handle DELETE
    IF TG_OP = 'DELETE' THEN
        DELETE FROM public.team_members_public WHERE team_member_id = OLD.id;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$;

-- Create the trigger
CREATE TRIGGER sync_team_member_public_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.team_members
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_team_member_public();

-- Sync existing data to the public table
INSERT INTO public.team_members_public (
    team_member_id, name, title, bio, image_url, 
    linkedin_url, twitter_url, order_index, is_featured, created_at, updated_at
)
SELECT 
    id, name, title, bio, image_url, 
    linkedin_url, twitter_url, order_index, is_featured, created_at, updated_at
FROM public.team_members;