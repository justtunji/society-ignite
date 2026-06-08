import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch a single section's content from `section_content`.
 * Returns `{ ...defaults, ...row.content }` so callers always have a fully-populated object.
 * If `is_visible` is false, returns `null` to let the caller hide the section.
 */
export function useSectionContent<T extends Record<string, any>>(
  pageKey: string,
  sectionKey: string,
  defaults: T,
): T | null {
  const [content, setContent] = useState<T | null>(defaults);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('section_content')
        .select('content, is_visible')
        .eq('page_key', pageKey)
        .eq('section_key', sectionKey)
        .maybeSingle();
      if (cancelled) return;
      if (!data) { setContent(defaults); return; }
      if (data.is_visible === false) { setContent(null); return; }
      setContent({ ...defaults, ...((data.content as Record<string, any>) ?? {}) } as T);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey, sectionKey]);

  return content;
}
