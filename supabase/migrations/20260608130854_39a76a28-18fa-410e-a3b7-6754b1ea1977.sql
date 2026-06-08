DROP TABLE IF EXISTS public.communities CASCADE;
DELETE FROM public.section_content WHERE page_key = 'home' AND section_key = 'communities_intro';