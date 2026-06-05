
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin'::app_role, 'editor'::app_role)
  )
$$;

REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM anon;

-- Update content-table admin-edit policies to allow editors as well.
DO $$
DECLARE
  t text;
  pol text;
  tables text[] := ARRAY[
    'communities','events','gallery_items','navigation_items','pages',
    'partners','programs','promotions','resources','sections','stories',
    'team_members','team_members_public'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    -- Find any ALL-command policy that uses has_role admin and replace
    FOR pol IN
      SELECT policyname FROM pg_policies
      WHERE schemaname = 'public' AND tablename = t
        AND cmd = 'ALL'
    LOOP
      EXECUTE format('DROP POLICY %I ON public.%I', pol, t);
    END LOOP;
    EXECUTE format(
      'CREATE POLICY "Content editable by staff" ON public.%I FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()))',
      t
    );
  END LOOP;
END $$;
