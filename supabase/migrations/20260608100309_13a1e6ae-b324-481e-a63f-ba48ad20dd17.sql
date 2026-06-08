CREATE TABLE public.section_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL,
  section_key text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_visible boolean NOT NULL DEFAULT true,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_key, section_key)
);

GRANT SELECT ON public.section_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.section_content TO authenticated;
GRANT ALL ON public.section_content TO service_role;

ALTER TABLE public.section_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read section content"
  ON public.section_content FOR SELECT
  USING (true);

CREATE POLICY "Admins or permitted users can insert section content"
  ON public.section_content FOR INSERT TO authenticated
  WITH CHECK (public.has_permission(auth.uid(), 'sections', 'create'));

CREATE POLICY "Admins or permitted users can update section content"
  ON public.section_content FOR UPDATE TO authenticated
  USING (public.has_permission(auth.uid(), 'sections', 'update'))
  WITH CHECK (public.has_permission(auth.uid(), 'sections', 'update'));

CREATE POLICY "Admins or permitted users can delete section content"
  ON public.section_content FOR DELETE TO authenticated
  USING (public.has_permission(auth.uid(), 'sections', 'delete'));

CREATE TRIGGER update_section_content_updated_at
  BEFORE UPDATE ON public.section_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();