
GRANT INSERT ON public.members TO anon;
GRANT SELECT, INSERT, UPDATE ON public.members TO authenticated;
GRANT ALL ON public.members TO service_role;

DROP POLICY IF EXISTS "Public can submit membership applications" ON public.members;
CREATE POLICY "Public can submit membership applications"
ON public.members
FOR INSERT
TO anon, authenticated
WITH CHECK (user_id IS NULL);
