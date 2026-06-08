import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SectionSeo {
  seo_title?: string;
  seo_description?: string;
  og_image?: string;
}

/**
 * Resolve the first non-empty SEO override across a list of (pageKey, sectionKey)
 * pairs (priority order, first wins per field). Render the result as Helmet tags.
 *
 * Usage on a page:
 *   <SectionSeoTags
 *     fallbackTitle="Home | SBA"
 *     fallbackDescription="..."
 *     sections={[['home','conference'], ['home','programmes_intro'], ['home','impact']]}
 *     pageUrl="/"
 *   />
 */
export const SectionSeoTags = ({
  sections,
  fallbackTitle,
  fallbackDescription,
  fallbackOgImage,
  pageUrl,
}: {
  sections: Array<[string, string]>;
  fallbackTitle: string;
  fallbackDescription?: string;
  fallbackOgImage?: string;
  pageUrl: string;
}) => {
  const [overrides, setOverrides] = useState<SectionSeo>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const orFilters = sections
        .map(([p, s]) => `and(page_key.eq.${p},section_key.eq.${s})`)
        .join(',');
      const { data } = await supabase
        .from('section_content')
        .select('page_key, section_key, content')
        .or(orFilters);
      if (cancelled) return;
      // Build a quick lookup, then walk sections in declared order.
      const map = new Map<string, any>();
      (data ?? []).forEach((r: any) => map.set(`${r.page_key}::${r.section_key}`, r.content ?? {}));
      const merged: SectionSeo = {};
      for (const [p, s] of sections) {
        const c = map.get(`${p}::${s}`) ?? {};
        if (!merged.seo_title && c.seo_title) merged.seo_title = c.seo_title;
        if (!merged.seo_description && c.seo_description) merged.seo_description = c.seo_description;
        if (!merged.og_image && c.og_image) merged.og_image = c.og_image;
      }
      setOverrides(merged);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(sections)]);

  const title = overrides.seo_title || fallbackTitle;
  const description = overrides.seo_description || fallbackDescription;
  const ogImage = overrides.og_image || fallbackOgImage;
  const absoluteUrl = pageUrl.startsWith('http')
    ? pageUrl
    : `https://society-ignite.lovable.app${pageUrl}`;

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:type" content="website" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <link rel="canonical" href={absoluteUrl} />
    </Helmet>
  );
};
