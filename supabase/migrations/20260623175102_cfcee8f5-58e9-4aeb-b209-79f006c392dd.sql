
-- 1. site_settings: remove public SELECT
DROP POLICY IF EXISTS "Site settings viewable by everyone" ON public.site_settings;
REVOKE SELECT ON public.site_settings FROM anon;

-- 2. team_members: ensure no anon access
REVOKE ALL ON public.team_members FROM anon;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 3. storage.objects: drop the overly broad authenticated policies for cms-media and partner-logos
DROP POLICY IF EXISTS "Authenticated users can upload CMS media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update CMS media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete CMS media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload partner logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update partner logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete partner logos" ON storage.objects;
