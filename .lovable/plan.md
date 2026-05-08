This is a large set of corrections spanning multiple pages, components, and an infrastructure change (Cloudinary). I'll group them into logical batches and confirm a few ambiguous items before implementation.

## 1. Homepage changes
- Add a prominent "2026 Annual Conference" section near the top of the homepage.
- Shorten the homepage by removing/condensing lower-priority sections. Proposed removals: `PromotionsSection` (if currently shown), `ReportsSection`, `LatestStoriesSection` — keep Hero, Partner carousel, About, Programmes, Communities, Impact, Newsletter.
- Update Partner carousel title from "Partners & Sponsors" → "Partners, Supporters & Sponsors".

## 2. Header / Donate button
- Rename "Donate / Sponsor" → "Donate / Support" (keep existing Stripe link + new tab).

## 3. Join Us page
- Replace hero/membership image with a group photo (use an existing gallery photo with more people, e.g. one of the SBA event group shots).
- Change CTA copy: "Complete your membership" → "Support us and you'll get to attend our conference for free".
- Remove payment fields and any monetary figures from the membership form.
- Convert "Research tracks" free text → dropdown (single or multi-select — see Q1).
- Place "Become a Partner & Sponsor" CTA side-by-side with "Become a Member", with note "if you want to be a headline sponsor".

## 4. Events / Conference content
- Add upcoming items: 2026 Annual Conference, CABS event, all ManMet events. Surface on Home (conference) and Programs/Events pages (full list).

## 5. Resources page
- Curate to: HEPI report, YouTube channel, University of Edinburgh resource. Remove others not in this list (confirm in Q2).
- Remove the "Need something specific?" block.

## 6. About page
- Remove duplicate SBA logo (currently appears in Why SBA section + standalone logo section). Keep one.
- Increase typography size of "Why SBA" heading/body.
- Fix "Learn more" button under Why SBA — currently links to `/resources`; change to `/about` anchor or appropriate target (confirm in Q3).
- Move Mission/Vision/Values to sit beside Why SBA (two-column layout) instead of separate section below.
- Team section: ensure Ade appears first, all other team members below (order via `order_index`).
- Move Advisory Board to appear under the Team section with pictures (already pictures — just reorder to appear after team and confirm images render).
- General alignment fixes across sections.
- Ensure correct pictures are mapped to correct people (will need user input on which images are wrong — see Q4).

## 7. Impact section
- Update stat to "800+ institutions" and "15" (15 what? — confirm in Q4 if this is a separate stat).

## 8. Misc
- Remove FAQ section/page entirely.
- Simplify Contact page: pull contact email/phone/address from existing site settings, remove form clutter — keep a clean info card + minimal contact form.

## 9. Cloudinary integration (infrastructure)
- Add Cloudinary upload support to the admin `ImageUpload` component so admins can upload images directly to Cloudinary.
- Images saved in DB will reference the Cloudinary URL; existing Supabase `cms-media` images continue to work.
- Requires: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (stored as Supabase secrets) + an unsigned upload preset OR a signed-upload edge function. I'll use a signed-upload edge function for security.

## Technical notes
- No DB schema changes required for most items. Cloudinary integration adds one edge function (`cloudinary-sign`) and updates `ImageUpload.tsx` to optionally upload to Cloudinary.
- For "Manmet/CABS/2026 conference" content, I'll add seed entries via the Events admin (you can edit later) or hardcode initially — confirm in Q2.

## Clarifying questions before I start
I'll ask 4 short questions to resolve ambiguity, then implement everything in one pass.

