-- Fix Security Definer View issue by ensuring view runs with invoker rights
-- This prevents the view from implicitly using the creator's permissions
-- and aligns with Supabase Security Advisor rule 0010.

-- Set security_invoker on the public view used by the app
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_views
    WHERE schemaname = 'public' AND viewname = 'public_site_settings'
  ) THEN
    EXECUTE 'ALTER VIEW public.public_site_settings SET (security_invoker = on)';
  END IF;
END $$;
