---
name: Site Sections CMS
description: Field-level CRUD across every public page section via section_content table and schema-driven admin
type: feature
---
Public-site sections (Home, About, Programs, Resources, Gallery, Contact, Join Us) get an admin editor at `/admin/site-sections`.

- Table: `public.section_content (page_key, section_key, content jsonb, is_visible, order_index)`, unique on (page_key, section_key).
- RLS: public SELECT; writes guarded by `has_permission(auth.uid(), 'sections', <action>)`.
- Schemas: `src/lib/sectionSchemas.ts` — page → section → { fields[], defaults }.
- Hook: `useSectionContent(pageKey, sectionKey, defaults)` returns merged defaults+overrides; returns null when admin toggles visibility off.
- Admin: `src/pages/admin/SiteSectionsAdmin.tsx` (route `/admin/site-sections`, permission module `sections`).
- Wired components: HeroSection (home hero remains in Site Settings), AboutSection, ConferenceSection, ProgrammesSection, ImpactSection, CommunitiesSection, NewsletterSection (home); About hero/why_sba/mvv/team_intro/partners_cta; Contact hero/info; JoinUs hero/why_join/levels_intro/apply_intro; Programs hero; Resources hero; Gallery hero + past_events_intro.
- Home Hero is intentionally `managedElsewhere: 'Site Settings'`.
- Gallery photo items remain in the Gallery Items CRUD; section editor controls only the hero and the "Past Events" heading/visibility.
