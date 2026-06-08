import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { buildTokensCSS, buildSectionsCSS, buildElementsCSS, buildFontLinks, type DesignTokens } from '@/lib/designSystem';

const STYLE_ID = 'cms-design-system';
const FONT_LINK_ID = 'cms-design-fonts';

export const DesignSystemProvider = ({ children }: { children: React.ReactNode }) => {
  const [tokens, setTokens] = useState<DesignTokens>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [elements, setElements] = useState<any[]>([]);

  // Initial fetch + realtime subscriptions
  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      const [{ data: tk }, { data: sec }, { data: el }] = await Promise.all([
        supabase.from('design_tokens').select('*').limit(1).maybeSingle(),
        supabase.from('section_styles').select('*'),
        supabase.from('element_styles').select('*'),
      ]);
      if (cancelled) return;
      if (tk) setTokens(tk);
      setSections(sec || []);
      setElements(el || []);
    };
    fetchAll();

    const channel = supabase
      .channel('design-system')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'design_tokens' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'section_styles' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'element_styles' }, fetchAll)
      .subscribe();

    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, []);

  // Preview postMessage listener (for live preview iframe)
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!e.data || e.data.type !== 'design_preview') return;
      if (e.data.tokens) setTokens(e.data.tokens);
      if (e.data.sections) setSections(e.data.sections);
      if (e.data.elements) setElements(e.data.elements);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Inject <style> + Google Fonts
  useEffect(() => {
    let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent =
      buildTokensCSS(tokens) +
      buildSectionsCSS(sections) +
      buildElementsCSS(elements);

    // Font links
    const links = buildFontLinks(tokens);
    const existing = document.getElementById(FONT_LINK_ID);
    if (existing) existing.remove();
    if (links.length) {
      const link = document.createElement('link');
      link.id = FONT_LINK_ID;
      link.rel = 'stylesheet';
      link.href = links[0];
      document.head.appendChild(link);
    }
  }, [tokens, sections, elements]);

  return <>{children}</>;
};
