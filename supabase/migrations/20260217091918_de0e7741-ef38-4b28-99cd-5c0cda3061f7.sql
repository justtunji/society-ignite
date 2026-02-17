
-- ============================================================
-- FIX: Drop ALL restrictive policies and recreate as PERMISSIVE
-- ============================================================

-- navigation_items
DROP POLICY IF EXISTS "Navigation items are editable by authenticated users only" ON public.navigation_items;
DROP POLICY IF EXISTS "Navigation items are viewable by everyone" ON public.navigation_items;
CREATE POLICY "Navigation items are viewable by everyone" ON public.navigation_items FOR SELECT USING (true);
CREATE POLICY "Navigation items are editable by admins" ON public.navigation_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- partners
DROP POLICY IF EXISTS "Active partners are viewable by everyone" ON public.partners;
DROP POLICY IF EXISTS "Partners are editable by authenticated users only" ON public.partners;
CREATE POLICY "Partners are viewable by everyone" ON public.partners FOR SELECT USING (true);
CREATE POLICY "Partners are editable by admins" ON public.partners FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- resources
DROP POLICY IF EXISTS "Resources are editable by authenticated users only" ON public.resources;
DROP POLICY IF EXISTS "Resources are viewable by everyone" ON public.resources;
CREATE POLICY "Resources are viewable by everyone" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Resources are editable by admins" ON public.resources FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- promotions
DROP POLICY IF EXISTS "Active promotions are viewable by everyone" ON public.promotions;
DROP POLICY IF EXISTS "Promotions are editable by authenticated users only" ON public.promotions;
CREATE POLICY "Promotions are viewable by everyone" ON public.promotions FOR SELECT USING (true);
CREATE POLICY "Promotions are editable by admins" ON public.promotions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- stories
DROP POLICY IF EXISTS "Stories are editable by authenticated users only" ON public.stories;
DROP POLICY IF EXISTS "Stories are viewable by everyone" ON public.stories;
CREATE POLICY "Stories are viewable by everyone" ON public.stories FOR SELECT USING (true);
CREATE POLICY "Stories are editable by admins" ON public.stories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- communities
DROP POLICY IF EXISTS "Communities are editable by admins only" ON public.communities;
DROP POLICY IF EXISTS "Communities are viewable by everyone" ON public.communities;
CREATE POLICY "Communities are viewable by everyone" ON public.communities FOR SELECT USING (true);
CREATE POLICY "Communities are editable by admins" ON public.communities FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- programs
DROP POLICY IF EXISTS "Active programs are viewable by everyone" ON public.programs;
DROP POLICY IF EXISTS "Programs are editable by authenticated users only" ON public.programs;
CREATE POLICY "Programs are viewable by everyone" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Programs are editable by admins" ON public.programs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- events
DROP POLICY IF EXISTS "Active events are viewable by everyone" ON public.events;
DROP POLICY IF EXISTS "Events are editable by authenticated users only" ON public.events;
CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Events are editable by admins" ON public.events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- gallery_items
DROP POLICY IF EXISTS "Gallery items are editable by authenticated users only" ON public.gallery_items;
DROP POLICY IF EXISTS "Visible gallery items are viewable by everyone" ON public.gallery_items;
CREATE POLICY "Gallery items are viewable by everyone" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Gallery items are editable by admins" ON public.gallery_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- team_members
DROP POLICY IF EXISTS "Team members are editable by authenticated users only" ON public.team_members;
DROP POLICY IF EXISTS "Team members full access for authenticated users" ON public.team_members;
CREATE POLICY "Team members are viewable by admins" ON public.team_members FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Team members are editable by admins" ON public.team_members FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- team_members_public
DROP POLICY IF EXISTS "Public team member info is editable by authenticated users only" ON public.team_members_public;
DROP POLICY IF EXISTS "Public team member info is viewable by everyone" ON public.team_members_public;
CREATE POLICY "Public team members are viewable by everyone" ON public.team_members_public FOR SELECT USING (true);
CREATE POLICY "Public team members are editable by admins" ON public.team_members_public FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- site_settings
DROP POLICY IF EXISTS "Site settings are editable by authenticated users only" ON public.site_settings;
CREATE POLICY "Site settings are readable by admins" ON public.site_settings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Site settings are editable by admins" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- pages
DROP POLICY IF EXISTS "Pages are editable by authenticated users only" ON public.pages;
DROP POLICY IF EXISTS "Published pages are viewable by everyone" ON public.pages;
CREATE POLICY "Pages are viewable by everyone" ON public.pages FOR SELECT USING (true);
CREATE POLICY "Pages are editable by admins" ON public.pages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- sections
DROP POLICY IF EXISTS "Sections are editable by authenticated users only" ON public.sections;
DROP POLICY IF EXISTS "Sections are viewable by everyone" ON public.sections;
CREATE POLICY "Sections are viewable by everyone" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Sections are editable by admins" ON public.sections FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- contact_submissions: allow admins to read/update (not just service_role)
DROP POLICY IF EXISTS "Anyone can create contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Contact submissions are viewable by service role only" ON public.contact_submissions;
DROP POLICY IF EXISTS "Contact submissions are updatable by service role only" ON public.contact_submissions;
DROP POLICY IF EXISTS "Contact submissions are deletable by service role only" ON public.contact_submissions;
CREATE POLICY "Anyone can create contact submissions" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Contact submissions are viewable by admins" ON public.contact_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Contact submissions are updatable by admins" ON public.contact_submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Contact submissions are deletable by admins" ON public.contact_submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- user_roles (keep existing but fix)
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- members (keep existing but fix)
DROP POLICY IF EXISTS "Members can view their own profile" ON public.members;
DROP POLICY IF EXISTS "Members can update their own profile" ON public.members;
DROP POLICY IF EXISTS "Users can create their own member profile" ON public.members;
CREATE POLICY "Members can view their own profile" ON public.members FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Members can update their own profile" ON public.members FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own member profile" ON public.members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all members" ON public.members FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
