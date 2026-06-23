ALTER TABLE public.members
DROP CONSTRAINT IF EXISTS members_category_check;

ALTER TABLE public.members
ADD CONSTRAINT members_category_check
CHECK (
  category IS NULL
  OR category = ANY (ARRAY[
    'Student'::text,
    'Academic'::text,
    'Professional'::text,
    'Partner'::text,
    'Academic and Scholar Membership (ASM)'::text,
    'Executive Leader Membership (ELM)'::text,
    'Industry Practitioner Membership (IPM)'::text,
    'Student Membership (SM)'::text
  ])
);