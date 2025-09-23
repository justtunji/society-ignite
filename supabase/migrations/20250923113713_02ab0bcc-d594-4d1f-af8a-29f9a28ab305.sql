-- Fix the function search path security warning
-- Update the function to have a proper search_path set

DROP FUNCTION IF EXISTS public.get_public_team_members();

CREATE OR REPLACE FUNCTION public.get_public_team_members()
RETURNS SETOF public.team_members_public
LANGUAGE sql
STABLE
SET search_path = public
AS $$
    SELECT * FROM public.team_members_public 
    ORDER BY order_index ASC, name ASC;
$$;