
-- =========================================
-- 1. design_tokens (singleton)
-- =========================================
CREATE TABLE public.design_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Font families
  font_heading text DEFAULT 'DM Sans',
  font_body text DEFAULT 'DM Sans',
  font_button text,
  font_caption text,
  font_url text, -- optional custom @import / Google Fonts URL (heading)
  font_body_url text,

  -- Heading scale (H1-H6)
  h1_size text DEFAULT 'clamp(2.5rem, 5vw, 4rem)',
  h1_weight integer DEFAULT 700,
  h1_line_height text DEFAULT '1.1',
  h1_letter_spacing text DEFAULT '-0.02em',
  h1_color text,

  h2_size text DEFAULT 'clamp(2rem, 4vw, 3rem)',
  h2_weight integer DEFAULT 700,
  h2_line_height text DEFAULT '1.15',
  h2_letter_spacing text DEFAULT '-0.01em',
  h2_color text,

  h3_size text DEFAULT 'clamp(1.5rem, 3vw, 2.25rem)',
  h3_weight integer DEFAULT 600,
  h3_line_height text DEFAULT '1.2',
  h3_letter_spacing text DEFAULT '0',
  h3_color text,

  h4_size text DEFAULT '1.5rem',
  h4_weight integer DEFAULT 600,
  h4_line_height text DEFAULT '1.25',
  h4_letter_spacing text DEFAULT '0',
  h4_color text,

  h5_size text DEFAULT '1.25rem',
  h5_weight integer DEFAULT 600,
  h5_line_height text DEFAULT '1.3',
  h5_letter_spacing text DEFAULT '0',
  h5_color text,

  h6_size text DEFAULT '1rem',
  h6_weight integer DEFAULT 600,
  h6_line_height text DEFAULT '1.4',
  h6_letter_spacing text DEFAULT '0.02em',
  h6_color text,

  -- Headline (large display text, distinct from h1)
  headline_size text DEFAULT 'clamp(3rem, 6vw, 5rem)',
  headline_weight integer DEFAULT 700,
  headline_line_height text DEFAULT '1.05',
  headline_letter_spacing text DEFAULT '-0.03em',
  headline_color text,

  -- Body text
  body_size text DEFAULT '1rem',
  body_weight integer DEFAULT 400,
  body_line_height text DEFAULT '1.6',
  body_letter_spacing text DEFAULT '0',
  body_color text,

  -- Buttons
  button_size text DEFAULT '0.95rem',
  button_weight integer DEFAULT 600,
  button_line_height text DEFAULT '1.2',
  button_letter_spacing text DEFAULT '0.01em',
  button_color text,

  -- Captions / small text
  caption_size text DEFAULT '0.85rem',
  caption_weight integer DEFAULT 400,
  caption_line_height text DEFAULT '1.4',
  caption_letter_spacing text DEFAULT '0.02em',
  caption_color text,

  -- Link text
  link_color text,
  link_hover_color text,

  -- Color palette (HSL strings like "0 0% 100%" to match existing tokens)
  color_background text DEFAULT '0 0% 100%',
  color_foreground text DEFAULT '0 0% 0%',
  color_primary text DEFAULT '0 0% 0%',
  color_primary_foreground text DEFAULT '0 0% 100%',
  color_secondary text DEFAULT '0 0% 97%',
  color_secondary_foreground text DEFAULT '0 0% 0%',
  color_accent text DEFAULT '43 96% 56%',
  color_accent_foreground text DEFAULT '0 0% 0%',
  color_muted text DEFAULT '0 0% 96%',
  color_muted_foreground text DEFAULT '0 0% 45%',
  color_border text DEFAULT '0 0% 90%',
  color_card text DEFAULT '0 0% 100%',
  color_card_foreground text DEFAULT '0 0% 0%',
  color_destructive text DEFAULT '0 84% 60%',

  -- Spacing
  section_padding_y text DEFAULT '4rem',
  container_max_width text DEFAULT '1280px',
  radius_base text DEFAULT '0.5rem',
  radius_lg text DEFAULT '1rem',

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.design_tokens TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.design_tokens TO authenticated;
GRANT ALL ON public.design_tokens TO service_role;

ALTER TABLE public.design_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read design tokens"
  ON public.design_tokens FOR SELECT
  USING (true);

CREATE POLICY "Admins manage design tokens"
  ON public.design_tokens FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_design_tokens_updated_at
  BEFORE UPDATE ON public.design_tokens
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed a single row
INSERT INTO public.design_tokens DEFAULT VALUES;

-- =========================================
-- 2. section_styles
-- =========================================
CREATE TABLE public.section_styles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  label text,

  padding_top text,
  padding_bottom text,
  padding_x text,
  margin_top text,
  margin_bottom text,

  background_color text,
  background_image text,
  text_align text, -- left | center | right
  max_width text,
  gap text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.section_styles TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.section_styles TO authenticated;
GRANT ALL ON public.section_styles TO service_role;

ALTER TABLE public.section_styles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read section styles"
  ON public.section_styles FOR SELECT
  USING (true);

CREATE POLICY "Admins manage section styles"
  ON public.section_styles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_section_styles_updated_at
  BEFORE UPDATE ON public.section_styles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- 3. element_styles
-- =========================================
CREATE TABLE public.element_styles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_route text NOT NULL DEFAULT '*', -- '*' = all pages
  style_id text NOT NULL,
  label text,
  breakpoint text NOT NULL DEFAULT 'base', -- base | md | lg

  font_family text,
  font_size text,
  font_weight integer,
  font_color text,
  line_height text,
  letter_spacing text,
  text_align text,
  text_transform text,

  padding_top text,
  padding_bottom text,
  padding_left text,
  padding_right text,
  margin_top text,
  margin_bottom text,
  margin_left text,
  margin_right text,

  background_color text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (page_route, style_id, breakpoint)
);

GRANT SELECT ON public.element_styles TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.element_styles TO authenticated;
GRANT ALL ON public.element_styles TO service_role;

ALTER TABLE public.element_styles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read element styles"
  ON public.element_styles FOR SELECT
  USING (true);

CREATE POLICY "Admins manage element styles"
  ON public.element_styles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_element_styles_updated_at
  BEFORE UPDATE ON public.element_styles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
