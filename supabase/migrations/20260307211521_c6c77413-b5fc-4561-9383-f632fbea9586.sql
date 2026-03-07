
-- Drop all existing RESTRICTIVE policies and recreate as PERMISSIVE

-- communities
DROP POLICY IF EXISTS "Communities viewable by everyone" ON public.communities;
DROP POLICY IF EXISTS "Communities editable by admins" ON public.communities;
CREATE POLICY "Communities viewable by everyone" ON public.communities AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Communities editable by admins" ON public.communities AS PERMISSIVE FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- stories
DROP POLICY IF EXISTS "Stories viewable by everyone" ON public.stories;
DROP POLICY IF EXISTS "Stories editable by admins" ON public.stories;
CREATE POLICY "Stories viewable by everyone" ON public.stories AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Stories editable by admins" ON public.stories AS PERMISSIVE FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- partners
DROP POLICY IF EXISTS "Partners viewable by everyone" ON public.partners;
DROP POLICY IF EXISTS "Partners editable by admins" ON public.partners;
CREATE POLICY "Partners viewable by everyone" ON public.partners AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Partners editable by admins" ON public.partners AS PERMISSIVE FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- events
DROP POLICY IF EXISTS "Events viewable by everyone" ON public.events;
DROP POLICY IF EXISTS "Events editable by admins" ON public.events;
CREATE POLICY "Events viewable by everyone" ON public.events AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Events editable by admins" ON public.events AS PERMISSIVE FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- gallery_items
DROP POLICY IF EXISTS "Gallery items viewable by everyone" ON public.gallery_items;
DROP POLICY IF EXISTS "Gallery items editable by admins" ON public.gallery_items;
CREATE POLICY "Gallery items viewable by everyone" ON public.gallery_items AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Gallery items editable by admins" ON public.gallery_items AS PERMISSIVE FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- programs
DROP POLICY IF EXISTS "Programs viewable by everyone" ON public.programs;
DROP POLICY IF EXISTS "Programs editable by admins" ON public.programs;
CREATE POLICY "Programs viewable by everyone" ON public.programs AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Programs editable by admins" ON public.programs AS PERMISSIVE FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- promotions
DROP POLICY IF EXISTS "Promotions viewable by everyone" ON public.promotions;
DROP POLICY IF EXISTS "Promotions editable by admins" ON public.promotions;
CREATE POLICY "Promotions viewable by everyone" ON public.promotions AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Promotions editable by admins" ON public.promotions AS PERMISSIVE FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- resources
DROP POLICY IF EXISTS "Resources viewable by everyone" ON public.resources;
DROP POLICY IF EXISTS "Resources editable by admins" ON public.resources;
CREATE POLICY "Resources viewable by everyone" ON public.resources AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Resources editable by admins" ON public.resources AS PERMISSIVE FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- navigation_items
DROP POLICY IF EXISTS "Navigation items viewable by everyone" ON public.navigation_items;
DROP POLICY IF EXISTS "Navigation items editable by admins" ON public.navigation_items;
CREATE POLICY "Navigation items viewable by everyone" ON public.navigation_items AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Navigation items editable by admins" ON public.navigation_items AS PERMISSIVE FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- pages
DROP POLICY IF EXISTS "Pages viewable by everyone" ON public.pages;
DROP POLICY IF EXISTS "Pages editable by admins" ON public.pages;
CREATE POLICY "Pages viewable by everyone" ON public.pages AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Pages editable by admins" ON public.pages AS PERMISSIVE FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- sections
DROP POLICY IF EXISTS "Sections viewable by everyone" ON public.sections;
DROP POLICY IF EXISTS "Sections editable by admins" ON public.sections;
CREATE POLICY "Sections viewable by everyone" ON public.sections AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Sections editable by admins" ON public.sections AS PERMISSIVE FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- site_settings
DROP POLICY IF EXISTS "Site settings viewable by everyone" ON public.site_settings;
DROP POLICY IF EXISTS "Site settings manageable by admins" ON public.site_settings;
CREATE POLICY "Site settings viewable by everyone" ON public.site_settings AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Site settings manageable by admins" ON public.site_settings AS PERMISSIVE FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- team_members
DROP POLICY IF EXISTS "Team members manageable by admins" ON public.team_members;
CREATE POLICY "Team members manageable by admins" ON public.team_members AS PERMISSIVE FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- team_members_public
DROP POLICY IF EXISTS "Public team members viewable by everyone" ON public.team_members_public;
DROP POLICY IF EXISTS "Public team members editable by admins" ON public.team_members_public;
CREATE POLICY "Public team members viewable by everyone" ON public.team_members_public AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Public team members editable by admins" ON public.team_members_public AS PERMISSIVE FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- contact_submissions
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Contact submissions manageable by admins" ON public.contact_submissions;
CREATE POLICY "Anyone can insert contact submissions" ON public.contact_submissions AS PERMISSIVE FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Contact submissions manageable by admins" ON public.contact_submissions AS PERMISSIVE FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- user_roles
DROP POLICY IF EXISTS "Users view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins manage all roles" ON public.user_roles;
CREATE POLICY "Users view own roles" ON public.user_roles AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage all roles" ON public.user_roles AS PERMISSIVE FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- members
DROP POLICY IF EXISTS "Members view own profile" ON public.members;
DROP POLICY IF EXISTS "Members update own profile" ON public.members;
DROP POLICY IF EXISTS "Users create own member profile" ON public.members;
DROP POLICY IF EXISTS "Admins manage all members" ON public.members;
CREATE POLICY "Members view own profile" ON public.members AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Members update own profile" ON public.members AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create own member profile" ON public.members AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage all members" ON public.members AS PERMISSIVE FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
