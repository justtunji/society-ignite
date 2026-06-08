---
name: Page Builder
description: Block-based CMS for creating public content pages at /:slug with hero, rich text, image, CTA, gallery, and embed blocks
type: feature
---
Super Admins (and editors with `pages` permission) create dynamic content pages at `/admin/pages` (PagesBuilder.tsx). Pages are stored in `cms_pages` (slug, title, SEO, status, blocks jsonb). Block types defined in `src/lib/pageBlocks.ts`: hero, rich_text, image, cta, gallery, embed. Public renderer at `src/components/PageBlockRenderer.tsx`. Public route `/:slug` resolves via `src/pages/DynamicPage.tsx`; reserved slugs (about, resources, gallery, contact, join-us, programs, admin, p) fall through to 404. Only `status='published'` pages are publicly visible (RLS enforced).
