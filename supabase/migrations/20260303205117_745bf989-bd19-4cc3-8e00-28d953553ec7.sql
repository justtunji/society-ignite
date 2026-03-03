
-- Fix all RLS policies from RESTRICTIVE to PERMISSIVE

-- communities
DROP POLICY IF EXISTS "Communities are editable by admins" ON public.communities;
DROP POLICY IF EXISTS "Communities are viewable by everyone" ON public.communities;
CREATE POLICY "Communities viewable by everyone" ON public.communities AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Communities editable by admins" ON public.communities AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- contact_submissions
DROP POLICY IF EXISTS "Anyone can create contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Contact submissions manageable by admins" ON public.contact_submissions;
CREATE POLICY "Anyone can insert contact submissions" ON public.contact_submissions AS PERMISSIVE FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Contact submissions manageable by admins" ON public.contact_submissions AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- events
DROP POLICY IF EXISTS "Events are editable by admins" ON public.events;
DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
CREATE POLICY "Events viewable by everyone" ON public.events AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Events editable by admins" ON public.events AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- gallery_items
DROP POLICY IF EXISTS "Gallery items are editable by admins" ON public.gallery_items;
DROP POLICY IF EXISTS "Gallery items are viewable by everyone" ON public.gallery_items;
CREATE POLICY "Gallery items viewable by everyone" ON public.gallery_items AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Gallery items editable by admins" ON public.gallery_items AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- members
DROP POLICY IF EXISTS "Admins can manage all members" ON public.members;
DROP POLICY IF EXISTS "Members can update their own profile" ON public.members;
DROP POLICY IF EXISTS "Members can view their own profile" ON public.members;
DROP POLICY IF EXISTS "Users can create their own member profile" ON public.members;
CREATE POLICY "Admins manage all members" ON public.members AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Members view own profile" ON public.members AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Members update own profile" ON public.members AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create own member profile" ON public.members AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- navigation_items
DROP POLICY IF EXISTS "Navigation items are editable by admins" ON public.navigation_items;
DROP POLICY IF EXISTS "Navigation items are viewable by everyone" ON public.navigation_items;
CREATE POLICY "Navigation items viewable by everyone" ON public.navigation_items AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Navigation items editable by admins" ON public.navigation_items AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- pages
DROP POLICY IF EXISTS "Pages are editable by admins" ON public.pages;
DROP POLICY IF EXISTS "Pages are viewable by everyone" ON public.pages;
CREATE POLICY "Pages viewable by everyone" ON public.pages AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Pages editable by admins" ON public.pages AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- partners
DROP POLICY IF EXISTS "Partners are editable by admins" ON public.partners;
DROP POLICY IF EXISTS "Partners are viewable by everyone" ON public.partners;
CREATE POLICY "Partners viewable by everyone" ON public.partners AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Partners editable by admins" ON public.partners AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- programs
DROP POLICY IF EXISTS "Programs are editable by admins" ON public.programs;
DROP POLICY IF EXISTS "Programs are viewable by everyone" ON public.programs;
CREATE POLICY "Programs viewable by everyone" ON public.programs AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Programs editable by admins" ON public.programs AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- promotions
DROP POLICY IF EXISTS "Promotions are editable by admins" ON public.promotions;
DROP POLICY IF EXISTS "Promotions are viewable by everyone" ON public.promotions;
CREATE POLICY "Promotions viewable by everyone" ON public.promotions AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Promotions editable by admins" ON public.promotions AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- resources
DROP POLICY IF EXISTS "Resources are editable by admins" ON public.resources;
DROP POLICY IF EXISTS "Resources are viewable by everyone" ON public.resources;
CREATE POLICY "Resources viewable by everyone" ON public.resources AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Resources editable by admins" ON public.resources AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- sections
DROP POLICY IF EXISTS "Sections are editable by admins" ON public.sections;
DROP POLICY IF EXISTS "Sections are viewable by everyone" ON public.sections;
CREATE POLICY "Sections viewable by everyone" ON public.sections AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Sections editable by admins" ON public.sections AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- site_settings
DROP POLICY IF EXISTS "Site settings are manageable by admins" ON public.site_settings;
CREATE POLICY "Site settings manageable by admins" ON public.site_settings AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Site settings viewable by everyone" ON public.site_settings AS PERMISSIVE FOR SELECT TO public USING (true);

-- stories
DROP POLICY IF EXISTS "Stories are editable by admins" ON public.stories;
DROP POLICY IF EXISTS "Stories are viewable by everyone" ON public.stories;
CREATE POLICY "Stories viewable by everyone" ON public.stories AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Stories editable by admins" ON public.stories AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- team_members
DROP POLICY IF EXISTS "Team members are manageable by admins" ON public.team_members;
CREATE POLICY "Team members manageable by admins" ON public.team_members AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- team_members_public
DROP POLICY IF EXISTS "Public team members are editable by admins" ON public.team_members_public;
DROP POLICY IF EXISTS "Public team members are viewable by everyone" ON public.team_members_public;
CREATE POLICY "Public team members viewable by everyone" ON public.team_members_public AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Public team members editable by admins" ON public.team_members_public AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- user_roles
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Admins manage all roles" ON public.user_roles AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users view own roles" ON public.user_roles AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
