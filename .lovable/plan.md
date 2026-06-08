## Goal

Give admins full control over the website's typography, colors, spacing, and per-element styling from the CMS, with a live preview that updates as they type, and changes that propagate site-wide on save.

## Approach: CSS variables + data-attribute targeting

The site already uses semantic CSS variables (`--primary`, `--foreground`, `--accent`, etc.) in `index.css`. We extend this pattern instead of replacing it. Admin-defined design tokens are written into a single `<style>` tag injected at the document root; per-element overrides target elements via stable `data-style-id` attributes.

This avoids refactoring every component to read props and keeps the live preview cheap (rewrite one `<style>` tag).

## Database

Three new tables (migrations to follow):

1. `design_tokens` — singleton row with global style tokens.
   - Heading: family, weights for H1–H6, sizes (clamp values), line-height, letter-spacing, color
   - Headline / body / button / caption / link: family, size, weight, line-height, letter-spacing, color
   - Color palette: primary, primary-foreground, secondary, accent, accent-foreground, background, foreground, muted, border (HSL strings)
   - Radius scale, shadow scale, default section padding (y), default container max-width

2. `section_styles` — per-section overrides keyed by `section_key` (existing `sections.key` column).
   - padding_top, padding_bottom, padding_x, margin_top, margin_bottom
   - background_color, background_image, text_align
   - max_width, gap

3. `element_styles` — per-element overrides keyed by `(page_route, style_id)`.
   - All typography props + spacing props + color
   - Optional `breakpoint` enum (base, md, lg) for responsive overrides

Each table: admin-only write via `has_role(auth.uid(),'admin')`; public read via a `SECURITY DEFINER` function exposed through a view (same pattern as `public_site_settings`), with explicit GRANTs to `anon` and `authenticated`.

## Frontend runtime

- `DesignSystemProvider` at the app root fetches `public_design_tokens`, `public_section_styles`, `public_element_styles` once, subscribes via Supabase realtime, and renders a `<style id="cms-design-system">` tag that emits:
  - `:root { --heading-font: ...; --h1-size: ...; --color-primary: ...; ... }` from `design_tokens`
  - `[data-section="hero"] { padding-block: ...; background: ...; }` from `section_styles`
  - `[data-style-id="hero-headline"] { font-family: var(--heading-font); font-size: ...; }` from `element_styles`
- A small `useDesignToken()` hook for ad-hoc reads.
- Existing components get `data-section` (top-level wrapper) and `data-style-id` attributes on key text/CTA elements (headlines, body copy, buttons, captions). We tag the highest-value targets first: Hero headline/subheadline/CTA, Section headings (H2s), body text in About/Programmes/Impact, Footer.
- Tailwind config maps `font-heading`, `font-body`, `text-h1`…`text-h6`, `text-headline`, `text-body`, `text-caption` to the new variables so existing classes pick up changes automatically.

## Admin UI: `/admin/design`

New top-level admin route with a split layout: settings on the left, **live preview iframe** on the right pointing at the public site. The iframe receives token updates via `postMessage`; the provider applies them to the in-memory `<style>` tag without saving until the admin clicks **Save**.

Tabs:
1. **Typography** — font pickers (Google Fonts list + custom URL), sliders for H1–H6 size/weight/line-height/letter-spacing, separate panels for headline, body, button, caption.
2. **Colors** — color pickers for the full token palette with contrast warnings.
3. **Spacing & Layout** — global section padding, container widths, radius scale.
4. **Sections** — dropdown of all registered sections; per-section padding/margin/background/alignment.
5. **Elements** — page picker → element picker (lists every `data-style-id` discovered) → full style controls. Includes a "Pick element" mode that highlights elements in the preview iframe on hover and selects on click.

Permissions: gated by a new `design` module in `ADMIN_MODULES` so super admins can grant access.

## Why this scales

- Token-first design means new components automatically inherit admin styles without further work.
- Per-section/element overrides are additive — no override means the global token wins.
- Live preview uses the same provider as production, so what admins see is what visitors get.

## Out of scope (initial release)

- Per-component variants beyond `data-style-id` targets (e.g. styling internals of shadcn cards) — admins can still affect those via global tokens.
- Saved design presets / themes library — can be added later by snapshotting `design_tokens` rows.
- Animation controls — typography/color/spacing only in v1.

## Build order

1. Migrations: create 3 tables + public views + grants. **Approval gate.**
2. Wire `DesignSystemProvider` + `<style>` tag injection; update Tailwind config + `index.css` to consume new variables; add `data-section`/`data-style-id` to Hero, Header, Footer, ConferenceSection, AboutSection, ProgrammesSection (highest-value targets).
3. Build `/admin/design` Typography + Colors tabs with live preview (no element picker yet) — first usable slice.
4. Add Spacing/Layout + Sections tabs.
5. Add Elements tab with iframe element picker.
6. Add `design` to `ADMIN_MODULES` and seed permissions UI.

I'll pause for approval after step 1 (migration review) and after step 3 (first usable slice) so you can sanity-check direction before I keep building.

## Technical details (for engineers)

- `public_design_tokens` returns the singleton row; `public_section_styles` returns all rows; `public_element_styles` returns all rows. All three exposed via `SECURITY DEFINER` SQL functions with explicit `GRANT EXECUTE TO anon, authenticated`.
- The `<style>` tag is regenerated by a memoized builder; element rules are concatenated with stable ordering (global → section → element → responsive) so cascade is predictable.
- The preview iframe is the existing public site with `?design_preview=1`; a tiny listener in `DesignSystemProvider` accepts `postMessage({type:'design_preview', tokens})` and applies without saving.
- Font loading: heading/body fonts are injected as `<link rel="stylesheet">` to Google Fonts; custom families allow a URL field.
