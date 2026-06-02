ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[];
CREATE INDEX IF NOT EXISTS idx_gallery_items_category_order ON public.gallery_items (category, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_items_tags ON public.gallery_items USING GIN(tags);