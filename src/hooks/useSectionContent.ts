import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch a single section's content from `section_content`.
 * Returns `{ ...defaults, ...row.content }` so callers always have a fully-populated object.
 * If `is_visible` is false, returns `null` to let the caller hide the section.
 *
 * Live preview: when the page is loaded inside the admin live preview iframe,
 * it listens for `lovable-section-preview` messages from the parent window and
 * overrides the content for the matching page/section.
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

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const msg = e.data;
      if (!msg || msg.type !== 'lovable-section-preview') return;
      if (msg.pageKey !== pageKey || msg.sectionKey !== sectionKey) return;
      if (msg.isVisible === false) { setContent(null); return; }
      setContent({ ...defaults, ...(msg.content ?? {}) } as T);
    };
    window.addEventListener('message', onMessage);
    // Signal readiness so the parent can replay the latest override.
    try { window.parent?.postMessage({ type: 'lovable-section-preview-ready', pageKey, sectionKey }, '*'); } catch {}
    return () => window.removeEventListener('message', onMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey, sectionKey]);

  return content;
}
