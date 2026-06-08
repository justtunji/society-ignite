// Helpers for the CMS-driven design system.
// Converts a design_tokens row (+ section_styles + element_styles) into a single CSS string
// that's injected into the document as a <style> tag.

export type DesignTokens = Record<string, any> | null;
export type SectionStyle = Record<string, any>;
export type ElementStyle = Record<string, any>;

const cssVar = (name: string, value: any) =>
  value === null || value === undefined || value === '' ? '' : `  --${name}: ${value};\n`;

export function buildTokensCSS(t: DesignTokens): string {
  if (!t) return '';
  let css = ':root {\n';

  // Colors (HSL strings to remain compatible with hsl(var(--x)) usage)
  css += cssVar('background', t.color_background);
  css += cssVar('foreground', t.color_foreground);
  css += cssVar('primary', t.color_primary);
  css += cssVar('primary-foreground', t.color_primary_foreground);
  css += cssVar('secondary', t.color_secondary);
  css += cssVar('secondary-foreground', t.color_secondary_foreground);
  css += cssVar('accent', t.color_accent);
  css += cssVar('accent-foreground', t.color_accent_foreground);
  css += cssVar('muted', t.color_muted);
  css += cssVar('muted-foreground', t.color_muted_foreground);
  css += cssVar('border', t.color_border);
  css += cssVar('card', t.color_card);
  css += cssVar('card-foreground', t.color_card_foreground);
  css += cssVar('destructive', t.color_destructive);

  // Typography variables
  css += cssVar('font-heading', t.font_heading ? `'${t.font_heading}', sans-serif` : '');
  css += cssVar('font-body', t.font_body ? `'${t.font_body}', sans-serif` : '');
  css += cssVar('font-button', t.font_button ? `'${t.font_button}', sans-serif` : '');
  css += cssVar('font-caption', t.font_caption ? `'${t.font_caption}', sans-serif` : '');
  css += cssVar('font-eyebrow', t.font_eyebrow ? `'${t.font_eyebrow}', sans-serif` : '');

  for (const h of ['h1','h2','h3','h4','h5','h6']) {
    css += cssVar(`${h}-size`, t[`${h}_size`]);
    css += cssVar(`${h}-weight`, t[`${h}_weight`]);
    css += cssVar(`${h}-line-height`, t[`${h}_line_height`]);
    css += cssVar(`${h}-letter-spacing`, t[`${h}_letter_spacing`]);
    css += cssVar(`${h}-color`, t[`${h}_color`]);
  }
  for (const k of ['headline','body','button','caption','eyebrow']) {
    css += cssVar(`${k}-size`, t[`${k}_size`]);
    css += cssVar(`${k}-weight`, t[`${k}_weight`]);
    css += cssVar(`${k}-line-height`, t[`${k}_line_height`]);
    css += cssVar(`${k}-letter-spacing`, t[`${k}_letter_spacing`]);
    css += cssVar(`${k}-color`, t[`${k}_color`]);
  }

  css += cssVar('section-py', t.section_padding_y);
  css += cssVar('container-max', t.container_max_width);
  css += cssVar('radius', t.radius_base);
  css += cssVar('radius-lg', t.radius_lg);
  css += '}\n';

  // Body font default
  if (t.font_body) {
    css += `body { font-family: var(--font-body); }\n`;
  }
  if (t.font_heading) {
    css += `h1,h2,h3,h4,h5,h6 { font-family: var(--font-heading); }\n`;
  }

  // Per heading rules
  for (const h of ['h1','h2','h3','h4','h5','h6']) {
    const parts: string[] = [];
    if (t[`${h}_size`]) parts.push(`font-size: var(--${h}-size);`);
    if (t[`${h}_weight`]) parts.push(`font-weight: var(--${h}-weight);`);
    if (t[`${h}_line_height`]) parts.push(`line-height: var(--${h}-line-height);`);
    if (t[`${h}_letter_spacing`]) parts.push(`letter-spacing: var(--${h}-letter-spacing);`);
    if (t[`${h}_color`]) parts.push(`color: ${t[`${h}_color`]};`);
    if (parts.length) css += `${h} { ${parts.join(' ')} }\n`;
  }

  // Buttons
  const btnParts: string[] = [];
  if (t.font_button) btnParts.push(`font-family: var(--font-button);`);
  if (t.button_size) btnParts.push(`font-size: var(--button-size);`);
  if (t.button_weight) btnParts.push(`font-weight: var(--button-weight);`);
  if (t.button_letter_spacing) btnParts.push(`letter-spacing: var(--button-letter-spacing);`);
  if (btnParts.length) css += `button, .btn, [data-style-id*="button"] { ${btnParts.join(' ')} }\n`;

  // Caption helper class
  const capParts: string[] = [];
  if (t.font_caption) capParts.push(`font-family: var(--font-caption);`);
  if (t.caption_size) capParts.push(`font-size: var(--caption-size);`);
  if (t.caption_weight) capParts.push(`font-weight: var(--caption-weight);`);
  if (t.caption_letter_spacing) capParts.push(`letter-spacing: var(--caption-letter-spacing);`);
  if (capParts.length) css += `.caption, [data-style-id*="caption"] { ${capParts.join(' ')} }\n`;

  // Eyebrow (small label/uppercase text above headings)
  const ebParts: string[] = [];
  if (t.font_eyebrow) ebParts.push(`font-family: var(--font-eyebrow);`);
  if (t.eyebrow_size) ebParts.push(`font-size: var(--eyebrow-size);`);
  if (t.eyebrow_weight) ebParts.push(`font-weight: var(--eyebrow-weight);`);
  if (t.eyebrow_line_height) ebParts.push(`line-height: var(--eyebrow-line-height);`);
  if (t.eyebrow_letter_spacing) ebParts.push(`letter-spacing: var(--eyebrow-letter-spacing);`);
  if (t.eyebrow_color) ebParts.push(`color: ${t.eyebrow_color};`);
  if (t.eyebrow_text_transform) ebParts.push(`text-transform: ${t.eyebrow_text_transform};`);
  if (ebParts.length) css += `.eyebrow, [data-style-id*="eyebrow"] { ${ebParts.join(' ')} }\n`;

  // Link colors
  if (t.link_color) css += `a { color: ${t.link_color}; }\n`;
  if (t.link_hover_color) css += `a:hover { color: ${t.link_hover_color}; }\n`;

  return css;
}

// Aliases map well-known section keys to richer CSS selectors so admins can
// style header, footer, nav, cards, forms, and buttons without touching code.
// Scoped to `body:not(:has([data-admin]))` so admin UI is never restyled.
const SECTION_SELECTOR_ALIASES: Record<string, string> = {
  header: '[data-section="header"], body:not(:has([data-admin])) header',
  footer: '[data-section="footer"], body:not(:has([data-admin])) footer',
  navigation: '[data-section="navigation"], [data-section="navigation-mobile"], body:not(:has([data-admin])) nav',
  card: 'body:not(:has([data-admin])) .rounded-lg.border.bg-card, [data-section="card"]',
  form: 'body:not(:has([data-admin])) form, [data-section="form"]',
  button: 'body:not(:has([data-admin])) button:not([data-admin] button), [data-section="button"]',
};

export function buildSectionsCSS(rows: SectionStyle[]): string {
  let css = '';
  for (const r of rows || []) {
    const parts: string[] = [];
    if (r.padding_top) parts.push(`padding-top: ${r.padding_top};`);
    if (r.padding_bottom) parts.push(`padding-bottom: ${r.padding_bottom};`);
    if (r.padding_x) parts.push(`padding-left: ${r.padding_x}; padding-right: ${r.padding_x};`);
    if (r.margin_top) parts.push(`margin-top: ${r.margin_top};`);
    if (r.margin_bottom) parts.push(`margin-bottom: ${r.margin_bottom};`);
    if (r.background_color) parts.push(`background-color: ${r.background_color};`);
    if (r.background_image) parts.push(`background-image: url('${r.background_image}'); background-size: cover; background-position: center;`);
    if (r.text_align) parts.push(`text-align: ${r.text_align};`);
    if (r.max_width) parts.push(`max-width: ${r.max_width}; margin-left: auto; margin-right: auto;`);
    if (r.gap) parts.push(`gap: ${r.gap};`);
    if (!parts.length) continue;
    const selector = SECTION_SELECTOR_ALIASES[r.section_key] || `[data-section="${r.section_key}"]`;
    css += `${selector} { ${parts.join(' ')} }\n`;
  }
  return css;
}

export function buildElementsCSS(rows: ElementStyle[]): string {
  let css = '';
  for (const r of rows || []) {
    const parts: string[] = [];
    if (r.font_family) parts.push(`font-family: '${r.font_family}', sans-serif;`);
    if (r.font_size) parts.push(`font-size: ${r.font_size};`);
    if (r.font_weight) parts.push(`font-weight: ${r.font_weight};`);
    if (r.font_color) parts.push(`color: ${r.font_color};`);
    if (r.line_height) parts.push(`line-height: ${r.line_height};`);
    if (r.letter_spacing) parts.push(`letter-spacing: ${r.letter_spacing};`);
    if (r.text_align) parts.push(`text-align: ${r.text_align};`);
    if (r.text_transform) parts.push(`text-transform: ${r.text_transform};`);
    if (r.padding_top) parts.push(`padding-top: ${r.padding_top};`);
    if (r.padding_bottom) parts.push(`padding-bottom: ${r.padding_bottom};`);
    if (r.padding_left) parts.push(`padding-left: ${r.padding_left};`);
    if (r.padding_right) parts.push(`padding-right: ${r.padding_right};`);
    if (r.margin_top) parts.push(`margin-top: ${r.margin_top};`);
    if (r.margin_bottom) parts.push(`margin-bottom: ${r.margin_bottom};`);
    if (r.margin_left) parts.push(`margin-left: ${r.margin_left};`);
    if (r.margin_right) parts.push(`margin-right: ${r.margin_right};`);
    if (r.background_color) parts.push(`background-color: ${r.background_color};`);
    if (!parts.length) continue;

    const scope = r.page_route && r.page_route !== '*'
      ? `[data-page="${r.page_route}"] [data-style-id="${r.style_id}"]`
      : `[data-style-id="${r.style_id}"]`;

    if (r.breakpoint === 'md') {
      css += `@media (min-width: 768px) { ${scope} { ${parts.join(' ')} } }\n`;
    } else if (r.breakpoint === 'lg') {
      css += `@media (min-width: 1024px) { ${scope} { ${parts.join(' ')} } }\n`;
    } else {
      css += `${scope} { ${parts.join(' ')} }\n`;
    }
  }
  return css;
}

const GOOGLE_FONT_FALLBACKS = new Set(['Arial','Helvetica','Times New Roman','Georgia','Courier New','Verdana','Tahoma','Trebuchet MS','system-ui','sans-serif','serif','monospace']);

export function buildFontLinks(t: DesignTokens): string[] {
  if (!t) return [];
  const families = new Set<string>();
  for (const key of ['font_heading','font_body','font_button','font_caption']) {
    const v = t[key];
    if (v && !GOOGLE_FONT_FALLBACKS.has(v)) families.add(v);
  }
  if (families.size === 0) return [];
  const family = Array.from(families)
    .map(f => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@300;400;500;600;700;800`)
    .join('&');
  return [`https://fonts.googleapis.com/css2?${family}&display=swap`];
}
