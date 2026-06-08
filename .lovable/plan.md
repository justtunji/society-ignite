## Goal

Let admins edit every visible field (headline, copy, image, CTA, toggles) of every section on every public page, without rewriting the page layouts.

## Approach

Keep the existing React section components. Back each one with a row in a new `section_content` table and load overrides at render time, falling back to today's hard-coded copy/images so nothing breaks if a row is missing.

A single new admin screen — **Site Sections** — lists every section grouped by page and opens a schema-driven form (text / textarea / rich text / image / url / boolean). Schemas live in code, so adding a new editable field is a one-line change.

## Data model

New table `public.section_content`:
- `page_key` text (e.g. `home`, `about`, `programs`, `resources`, `gallery`, `contact`, `join-us`)
- `section_key` text (e.g. `hero`, `about_intro`, `programmes`, `communities`, `partners_carousel`, `newsletter`, …)
- `content` jsonb — free-form per section schema
- `is_visible` boolean default true
- `order_index` int (only used where the page lets admins reorder)
- unique(`page_key`, `section_key`)

RLS: public `SELECT`; `has_permission(auth.uid(), 'sections', …)` for write. Grants for `anon`, `authenticated`, `service_role`.

## Code structure

```text
src/lib/sectionSchemas.ts        ← registry: page → section → { label, fields[], defaults }
src/hooks/useSectionContent.tsx  ← fetches one section row, returns merged { ...defaults, ...row.content }
src/pages/admin/SiteSectionsAdmin.tsx ← grouped list + dynamic form (reuses ImageUpload, RichTextEditor)
```

Each existing section component gets a 3-line change:
```ts
const c = useSectionContent('home', 'hero', HERO_DEFAULTS);
// use c.headline, c.subheadline, c.cta_label, c.image_url, ...
```

## Pages & sections covered

- **Home**: hero, about_intro, programmes, communities, conference, hepi_report, reports, sba_updates, partners_carousel, instagram, newsletter, latest_stories, promotions
- **About**: hero, mission, impact, team_intro
- **Programs**: hero, featured_intro
- **Resources**: hero, research_tracks_intro, sba_updates_intro
- **Gallery**: hero, past_events_intro
- **Contact**: hero, contact_info
- **Join Us**: hero, plus existing strict section order (kept intact, just text-editable)

Rows for collections (programs, partners, team, stories, etc.) stay in their own tables — those already have CRUD. `section_content` only governs the surrounding copy, hero text, CTA, toggles, and image.

## Admin UX

`/admin/site-sections`
- Sidebar: page list
- Main: cards per section, each with Edit + Visible toggle
- Edit dialog: dynamic form driven by the section's schema; live JSON fallback for advanced users
- Permission key: `sections` (already in the RBAC module list — Sections entry remains for the existing block-level builder)

## Rollout

1. Migration + grants + RLS.
2. Schemas registry + `useSectionContent` hook + admin screen.
3. Wire Home sections first (highest visibility), then About, then the rest in one pass.
4. Update memory (`features/site-sections`) and add to the admin sidebar.

## Out of scope

- Reordering sections on a page (kept on existing layouts; can be added later via `order_index` if you ask).
- Adding/removing sections (that's what the block builder under **Pages** is for).
- Theming / colors (lives in Site Settings).
