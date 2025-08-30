-- Create site settings table
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'Society of Black Academics',
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#000000',
  secondary_color TEXT NOT NULL DEFAULT '#FFFFFF', 
  accent_color TEXT DEFAULT '#FFD166',
  font_heading TEXT DEFAULT 'Inter',
  font_body TEXT DEFAULT 'Inter',
  tagline TEXT DEFAULT 'Driving Inclusive Change In Higher Education Sector',
  hero_headline TEXT DEFAULT 'Driving Inclusive Change In Higher Education Sector',
  hero_subheadline TEXT,
  hero_cta_label TEXT DEFAULT 'Join the Network',
  hero_cta_url TEXT DEFAULT '/contact',
  newsletter_provider TEXT DEFAULT 'mailerlite',
  newsletter_list_id TEXT,
  social_x TEXT,
  social_linkedin TEXT,
  social_instagram TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  footer_blurb TEXT,
  seo_default_title TEXT,
  seo_default_description TEXT,
  og_image_url TEXT,
  is_mega_menu BOOLEAN DEFAULT false,
  captcha_provider TEXT,
  captcha_site_key TEXT,
  captcha_secret_key TEXT,
  instagram_access_token TEXT,
  linkedin_access_token TEXT,
  linkedin_company_id TEXT,
  show_instagram_feed BOOLEAN DEFAULT true,
  show_linkedin_feed BOOLEAN DEFAULT true,
  email_fallback_provider TEXT DEFAULT 'postmark',
  email_from_address TEXT,
  email_from_name TEXT,
  show_partner_carousel BOOLEAN DEFAULT true,
  partner_carousel_speed INTEGER DEFAULT 60,
  partner_carousel_pause_on_hover BOOLEAN DEFAULT true,
  show_promotions_section BOOLEAN DEFAULT true,
  newsletter_position TEXT DEFAULT 'below_promotions',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for site_settings
CREATE POLICY "Site settings are viewable by everyone"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Site settings are editable by authenticated users only"
  ON public.site_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- Create navigation items table
CREATE TABLE public.navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  external BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  parent_id UUID REFERENCES public.navigation_items(id),
  visible BOOLEAN DEFAULT true,
  cta_style BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Navigation items are viewable by everyone"
  ON public.navigation_items FOR SELECT
  USING (visible = true);

CREATE POLICY "Navigation items are editable by authenticated users only"
  ON public.navigation_items FOR ALL
  USING (auth.role() = 'authenticated');

-- Create pages table
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  seo_title TEXT,
  seo_description TEXT,
  og_image_url TEXT,
  is_homepage BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published pages are viewable by everyone"
  ON public.pages FOR SELECT
  USING (status = 'published');

CREATE POLICY "Pages are editable by authenticated users only"
  ON public.pages FOR ALL
  USING (auth.role() = 'authenticated');

-- Create sections table for page builder
CREATE TABLE public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sections are viewable by everyone"
  ON public.sections FOR SELECT
  USING (true);

CREATE POLICY "Sections are editable by authenticated users only"
  ON public.sections FOR ALL
  USING (auth.role() = 'authenticated');

-- Create programs table
CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  long_description TEXT,
  program_type TEXT,
  hero_image_url TEXT,
  start_date DATE,
  end_date DATE,
  location_mode TEXT CHECK (location_mode IN ('online', 'in-person', 'hybrid')),
  location_text TEXT,
  eligibility TEXT,
  application_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active programs are viewable by everyone"
  ON public.programs FOR SELECT
  USING (status = 'active');

CREATE POLICY "Programs are editable by authenticated users only"
  ON public.programs FOR ALL
  USING (auth.role() = 'authenticated');

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  start_datetime TIMESTAMP WITH TIME ZONE,
  end_datetime TIMESTAMP WITH TIME ZONE,
  timezone TEXT DEFAULT 'UTC',
  location_mode TEXT CHECK (location_mode IN ('online', 'in-person', 'hybrid')),
  location_text TEXT,
  cover_image_url TEXT,
  registration_url TEXT,
  price DECIMAL,
  capacity INTEGER,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active events are viewable by everyone"
  ON public.events FOR SELECT
  USING (status = 'active');

CREATE POLICY "Events are editable by authenticated users only"
  ON public.events FOR ALL
  USING (auth.role() = 'authenticated');

-- Create resources table
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  resource_type TEXT,
  thumbnail_url TEXT,
  file_url TEXT, -- External URL for PDFs
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  topics TEXT[],
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Resources are viewable by everyone"
  ON public.resources FOR SELECT
  USING (true);

CREATE POLICY "Resources are editable by authenticated users only"
  ON public.resources FOR ALL
  USING (auth.role() = 'authenticated');

-- Create team members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  image_url TEXT,
  email TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members are viewable by everyone"
  ON public.team_members FOR SELECT
  USING (true);

CREATE POLICY "Team members are editable by authenticated users only"
  ON public.team_members FOR ALL
  USING (auth.role() = 'authenticated');

-- Create partners table
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  tier TEXT,
  order_index INTEGER DEFAULT 0,
  target_blank BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  carousel_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active partners are viewable by everyone"
  ON public.partners FOR SELECT
  USING (is_active = true);

CREATE POLICY "Partners are editable by authenticated users only"
  ON public.partners FOR ALL
  USING (auth.role() = 'authenticated');

-- Create promotions table
CREATE TABLE public.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sponsor_name TEXT,
  image_url TEXT,
  short_description TEXT,
  long_description TEXT,
  link TEXT,
  start_date DATE,
  end_date DATE,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active promotions are viewable by everyone"
  ON public.promotions FOR SELECT
  USING ((start_date IS NULL OR start_date <= CURRENT_DATE) AND (end_date IS NULL OR end_date >= CURRENT_DATE));

CREATE POLICY "Promotions are editable by authenticated users only"
  ON public.promotions FOR ALL
  USING (auth.role() = 'authenticated');

-- Create gallery items table
CREATE TABLE public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  photographer_credit TEXT,
  metadata JSONB DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  related_program_id UUID REFERENCES public.programs(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visible gallery items are viewable by everyone"
  ON public.gallery_items FOR SELECT
  USING (visible = true);

CREATE POLICY "Gallery items are editable by authenticated users only"
  ON public.gallery_items FOR ALL
  USING (auth.role() = 'authenticated');

-- Create members table
CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  category TEXT CHECK (category IN ('Student', 'Academic', 'Professional', 'Partner')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  preferences JSONB DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  mailerlite_subscribed BOOLEAN DEFAULT false,
  mailerlite_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their own profile"
  ON public.members FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can create a member profile"
  ON public.members FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Members are editable by authenticated users only"
  ON public.members FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create contact submissions table
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  source_page TEXT,
  handled BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create contact submissions"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Contact submissions are viewable by authenticated users only"
  ON public.contact_submissions FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX idx_programs_slug ON public.programs(slug);
CREATE INDEX idx_events_slug ON public.events(slug);
CREATE INDEX idx_resources_slug ON public.resources(slug);
CREATE INDEX idx_gallery_slug ON public.gallery_items(slug);
CREATE INDEX idx_promotions_featured ON public.promotions(featured);
CREATE INDEX idx_partners_carousel ON public.partners(carousel_visible, order_index);
CREATE INDEX idx_partners_order ON public.partners(order_index);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_navigation_items_updated_at BEFORE UPDATE ON public.navigation_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (
  site_name,
  hero_headline,
  hero_subheadline,
  hero_cta_label,
  tagline,
  primary_color,
  secondary_color,
  accent_color,
  show_partner_carousel,
  partner_carousel_speed,
  partner_carousel_pause_on_hover,
  show_promotions_section
) VALUES (
  'Society of Black Academics',
  'Driving Inclusive Change In Higher Education Sector',
  'Join a community of scholars, researchers, and educators committed to advancing diversity and excellence in academia.',
  'Join the Network',
  'Driving Inclusive Change In Higher Education Sector',
  '#000000',
  '#FFFFFF',
  '#FFD166',
  true,
  60,
  true,
  true
);

-- Insert navigation items
INSERT INTO public.navigation_items (label, url, order_index, cta_style) VALUES
  ('About', '/about', 1, false),
  ('Programs', '/programs', 2, false),
  ('Events', '/events', 3, false),
  ('Resources', '/resources', 4, false),
  ('Gallery', '/gallery', 5, false),
  ('Blog', '/blog', 6, false),
  ('Contact', '/contact', 7, false),
  ('Donate', '/donate', 8, true);

-- Insert sample programs
INSERT INTO public.programs (title, slug, short_description, long_description, program_type, status, tags) VALUES
  ('Academic Mentorship Program', 'academic-mentorship-program', 'Connect with experienced academics for career guidance', 'Our mentorship program pairs early-career scholars with established academics to provide guidance on research, publishing, and career development in higher education.', 'Mentorship', 'active', ARRAY['mentorship', 'career-development']),
  ('Research Fellowship Initiative', 'research-fellowship-initiative', 'Funding and support for innovative research projects', 'The Research Fellowship Initiative provides funding, resources, and institutional support for groundbreaking research projects led by Black academics across all disciplines.', 'Fellowship', 'active', ARRAY['research', 'funding', 'fellowship']);

-- Insert sample events
INSERT INTO public.events (title, slug, description, start_datetime, location_mode, status, tags) VALUES
  ('Annual Conference 2024', 'annual-conference-2024', 'Join us for our flagship annual conference featuring keynote speakers, panel discussions, and networking opportunities.', '2024-09-15 09:00:00+00', 'hybrid', 'active', ARRAY['conference', 'networking']),
  ('Research Methods Workshop', 'research-methods-workshop', 'A hands-on workshop covering advanced research methodologies for academic research.', '2024-08-20 14:00:00+00', 'online', 'active', ARRAY['workshop', 'research']);

-- Insert sample resources
INSERT INTO public.resources (title, slug, description, resource_type, file_url, topics, year) VALUES
  ('Academic Writing Guide', 'academic-writing-guide', 'Comprehensive guide to academic writing and publication', 'PDF', 'https://example.com/academic-writing-guide.pdf', ARRAY['writing', 'publication'], 2024),
  ('Grant Funding Directory', 'grant-funding-directory', 'Directory of available grants and funding opportunities', 'PDF', 'https://example.com/grant-directory.pdf', ARRAY['funding', 'grants'], 2024),
  ('Dissertation Toolkit', 'dissertation-toolkit', 'Essential tools and templates for dissertation writing', 'PDF', 'https://example.com/dissertation-toolkit.pdf', ARRAY['dissertation', 'templates'], 2024),
  ('Career Development Handbook', 'career-development-handbook', 'Guide to academic career planning and development', 'PDF', 'https://example.com/career-handbook.pdf', ARRAY['career', 'development'], 2024);

-- Insert sample team members
INSERT INTO public.team_members (name, title, bio, order_index, is_featured) VALUES
  ('Dr. Amara Johnson', 'Executive Director', 'Dr. Johnson leads our organization with over 15 years of experience in higher education administration and diversity initiatives.', 1, true),
  ('Prof. Marcus Williams', 'Academic Affairs Director', 'Prof. Williams oversees our academic programs and maintains partnerships with universities nationwide.', 2, true),
  ('Dr. Kimberly Davis', 'Research Coordinator', 'Dr. Davis manages our research initiatives and coordinates with academic institutions across the country.', 3, true),
  ('Dr. James Thompson', 'Outreach Director', 'Dr. Thompson leads our community outreach efforts and develops new partnerships with educational institutions.', 4, true);

-- Insert sample partners
INSERT INTO public.partners (name, website_url, description, order_index, carousel_visible, is_active) VALUES
  ('Harvard University', 'https://harvard.edu', 'Partnership for academic research and mentorship', 1, true, true),
  ('Stanford University', 'https://stanford.edu', 'Collaborative research initiatives', 2, true, true),
  ('MIT', 'https://mit.edu', 'Technology and innovation partnerships', 3, true, true),
  ('Yale University', 'https://yale.edu', 'Academic excellence and diversity programs', 4, true, true),
  ('Columbia University', 'https://columbia.edu', 'Research and academic collaboration', 5, true, true),
  ('Princeton University', 'https://princeton.edu', 'Scholarship and fellowship programs', 6, true, true);

-- Insert sample promotions
INSERT INTO public.promotions (title, slug, sponsor_name, short_description, long_description, link, featured, start_date, end_date) VALUES
  ('Academic Excellence Scholarship', 'academic-excellence-scholarship', 'Education Foundation', 'Scholarship opportunities for outstanding Black academics', 'The Academic Excellence Scholarship provides financial support for exceptional students and early-career academics pursuing advanced degrees in higher education.', 'https://example.com/scholarship', true, '2024-01-01', '2024-12-31'),
  ('Research Grant Program', 'research-grant-program', 'Research Institute', 'Funding for innovative research projects', 'Our Research Grant Program offers competitive funding for groundbreaking research projects that advance knowledge and promote diversity in academic research.', 'https://example.com/grants', true, '2024-01-01', '2024-12-31');

-- Insert sample gallery items
INSERT INTO public.gallery_items (title, slug, image_url, caption, photographer_credit, visible, display_order) VALUES
  ('Annual Conference Opening', 'annual-conference-opening', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800', 'Opening ceremony of our annual conference', 'Conference Photography Team', true, 1),
  ('Research Presentation', 'research-presentation', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800', 'Academic presenting research findings', 'Event Photography', true, 2),
  ('Networking Session', 'networking-session', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800', 'Networking during conference break', 'Professional Photography', true, 3),
  ('Workshop Session', 'workshop-session', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800', 'Interactive workshop on academic writing', 'Workshop Photography', true, 4);