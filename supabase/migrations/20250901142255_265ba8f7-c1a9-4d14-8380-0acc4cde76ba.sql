-- Secure site_settings by removing public SELECT and exposing a safe public view via a SECURITY DEFINER function
BEGIN;

-- 1) Remove public SELECT access policy on base table
DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON public.site_settings;

-- Note: Existing policy "Site settings are editable by authenticated users only" (ALL) already
-- allows authenticated users to read/update/insert/delete as needed.

-- 2) Create a SECURITY DEFINER function that returns ONLY non-sensitive columns
CREATE OR REPLACE FUNCTION public.get_public_site_settings()
RETURNS TABLE (
  id uuid,
  site_name text,
  logo_url text,
  favicon_url text,
  primary_color text,
  secondary_color text,
  accent_color text,
  font_heading text,
  font_body text,
  tagline text,
  show_promotions_section boolean,
  show_partner_carousel boolean,
  partner_carousel_speed integer,
  partner_carousel_pause_on_hover boolean,
  show_linkedin_feed boolean,
  show_instagram_feed boolean,
  is_mega_menu boolean,
  newsletter_position text,
  newsletter_provider text,
  social_x text,
  social_linkedin text,
  social_instagram text,
  contact_email text,
  contact_phone text,
  address text,
  footer_blurb text,
  seo_default_title text,
  seo_default_description text,
  og_image_url text,
  captcha_provider text,
  captcha_site_key text,
  hero_headline text,
  hero_subheadline text,
  hero_cta_label text,
  hero_cta_url text,
  created_at timestamptz,
  updated_at timestamptz
) 
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT
    id,
    site_name,
    logo_url,
    favicon_url,
    primary_color,
    secondary_color,
    accent_color,
    font_heading,
    font_body,
    tagline,
    show_promotions_section,
    show_partner_carousel,
    partner_carousel_speed,
    partner_carousel_pause_on_hover,
    show_linkedin_feed,
    show_instagram_feed,
    is_mega_menu,
    newsletter_position,
    newsletter_provider,
    social_x,
    social_linkedin,
    social_instagram,
    contact_email,
    contact_phone,
    address,
    footer_blurb,
    seo_default_title,
    seo_default_description,
    og_image_url,
    captcha_provider,
    captcha_site_key,
    hero_headline,
    hero_subheadline,
    hero_cta_label,
    hero_cta_url,
    created_at,
    updated_at
  FROM public.site_settings
  ORDER BY created_at DESC
  LIMIT 1
$$;

-- 3) Expose a simple view that selects from the function
CREATE OR REPLACE VIEW public.public_site_settings AS
SELECT * FROM public.get_public_site_settings();

-- 4) Grant access to anon & authenticated roles
GRANT EXECUTE ON FUNCTION public.get_public_site_settings() TO anon, authenticated;
GRANT SELECT ON public.public_site_settings TO anon, authenticated;

COMMENT ON VIEW public.public_site_settings IS 'Public, non-sensitive site settings view. Excludes tokens and secret keys.';

COMMIT;