import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Per-section appearance (background color, text color, background image,
 * vertical padding) is stored on `section_content.content._style` and applied
 * here via injected CSS targeting `[data-section="<section_key>"]`.
 *
 * Site Sections values take precedence over Design Admin global rules
 * (achieved with `!important`).
 */

export type SectionStyle = {
  background_color?: string;
  text_color?: string;
  background_image?: string;
  padding_y?: 'sm' | 'md' | 'lg' | 'xl' | '';
};

const PAD: Record<string, string> = {
  sm: '3rem',
  md: '5rem',
  lg: '7rem',
  xl: '9rem',
};

type Row = { page_key: string; section_key: string; content: any };

const ruleFor = (sectionKey: string, style: SectionStyle): string => {
  const decls: string[] = [];
  if (style.background_color) decls.push(`background-color: ${style.background_color} !important`);
  if (style.text_color) decls.push(`color: ${style.text_color} !important`);
  if (style.background_image) {
    decls.push(`background-image: url("${style.background_image}") !important`);
    decls.push(`background-size: cover !important`);
    decls.push(`background-position: center !important`);
  }
  if (style.padding_y && PAD[style.padding_y]) {
    decls.push(`padding-top: ${PAD[style.padding_y]} !important`);
    decls.push(`padding-bottom: ${PAD[style.padding_y]} !important`);
  }
  if (!decls.length) return '';
  // Escape selector value for attribute selector
  const safe = sectionKey.replace(/"/g, '\\"');
  return `[data-section="${safe}"]{${decls.join(';')}}`;
};

const extractStyle = (content: any): SectionStyle | null => {
  if (!content || typeof content !== 'object') return null;
  const s = (content as any)._style;
  if (!s || typeof s !== 'object') return null;
  return s as SectionStyle;
};

export const SectionContentStyles = () => {
  // Map of section_key -> CSS rule string
  const [rules, setRules] = useState<Record<string, string>>({});

  const setRule = (sectionKey: string, style: SectionStyle | null) => {
    setRules(prev => {
      const next = { ...prev };
      const css = style ? ruleFor(sectionKey, style) : '';
      if (css) next[sectionKey] = css;
      else delete next[sectionKey];
      return next;
    });
  };

  // Initial load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('section_content')
        .select('page_key, section_key, content');
      if (cancelled || !data) return;
      const next: Record<string, string> = {};
      (data as Row[]).forEach(r => {
        const style = extractStyle(r.content);
        if (!style) return;
        const css = ruleFor(r.section_key, style);
        if (css) next[r.section_key] = css;
      });
      setRules(next);
    })();
    return () => { cancelled = true; };
  }, []);

  // Live preview from admin iframe parent
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const m = e.data;
      if (!m || m.type !== 'lovable-section-preview') return;
      if (!m.sectionKey) return;
      const style = extractStyle(m.content);
      setRule(m.sectionKey, style);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const css = Object.values(rules).join('\n');
  if (!css) return null;
  return <style data-section-content-styles>{css}</style>;
};

export default SectionContentStyles;
