
-- 1) Lock down SECURITY DEFINER helpers not used inside RLS policies
REVOKE EXECUTE ON FUNCTION public.sync_team_member_public() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_public_site_settings() FROM PUBLIC, anon, authenticated;

-- 2) Remove broad list/SELECT policies on public storage buckets.
--    Public buckets still serve files via direct URL without RLS; removing the
--    SELECT policies only disables the ability to enumerate bucket contents.
DROP POLICY IF EXISTS "Public can view CMS media" ON storage.objects;
DROP POLICY IF EXISTS "CMS media is publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Partner logos are publicly accessible" ON storage.objects;

-- 3) Tighten the always-true INSERT policy on public contact submissions
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.contact_submissions;
CREATE POLICY "Anyone can insert contact submissions"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(btrim(name)) BETWEEN 1 AND 200
    AND char_length(btrim(email)) BETWEEN 3 AND 320
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(btrim(message)) BETWEEN 1 AND 5000
    AND (subject IS NULL OR char_length(subject) <= 300)
    AND (source_page IS NULL OR char_length(source_page) <= 300)
    AND (notes IS NULL OR char_length(notes) <= 2000)
    AND handled IS NOT TRUE
  );
