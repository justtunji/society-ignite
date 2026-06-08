
ALTER TABLE public.design_tokens
  ADD COLUMN IF NOT EXISTS font_eyebrow text,
  ADD COLUMN IF NOT EXISTS eyebrow_size text,
  ADD COLUMN IF NOT EXISTS eyebrow_weight integer,
  ADD COLUMN IF NOT EXISTS eyebrow_line_height text,
  ADD COLUMN IF NOT EXISTS eyebrow_letter_spacing text,
  ADD COLUMN IF NOT EXISTS eyebrow_color text,
  ADD COLUMN IF NOT EXISTS eyebrow_text_transform text;
