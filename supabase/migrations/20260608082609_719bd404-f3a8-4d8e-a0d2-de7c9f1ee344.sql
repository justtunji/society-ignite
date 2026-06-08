
CREATE TABLE IF NOT EXISTS public.cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  seo_title text,
  seo_description text,
  og_image_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.cms_pages TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.cms_pages TO authenticated;
GRANT ALL ON public.cms_pages TO service_role;

ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;

-- Anyone can read published pages
CREATE POLICY "Public reads published pages"
  ON public.cms_pages FOR SELECT
  USING (status = 'published' OR public.has_permission(auth.uid(), 'pages', 'read'));

-- Granular writes via has_permission
CREATE POLICY "Permitted users can insert pages"
  ON public.cms_pages FOR INSERT
  TO authenticated
  WITH CHECK (public.has_permission(auth.uid(), 'pages', 'create'));

CREATE POLICY "Permitted users can update pages"
  ON public.cms_pages FOR UPDATE
  TO authenticated
  USING (public.has_permission(auth.uid(), 'pages', 'update'))
  WITH CHECK (public.has_permission(auth.uid(), 'pages', 'update'));

CREATE POLICY "Permitted users can delete pages"
  ON public.cms_pages FOR DELETE
  TO authenticated
  USING (public.has_permission(auth.uid(), 'pages', 'delete'));

CREATE TRIGGER trg_cms_pages_updated_at
  BEFORE UPDATE ON public.cms_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON public.cms_pages(status);

-- Backfill: give existing editors full perms on the new "pages" module so they don't lose access patterns.
INSERT INTO public.user_permissions (user_id, module, can_create, can_read, can_update, can_delete)
SELECT ur.user_id, 'pages', true, true, true, true
FROM public.user_roles ur
WHERE ur.role = 'editor'
ON CONFLICT (user_id, module) DO NOTHING;
