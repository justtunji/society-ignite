import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const GOOGLE_FONTS = [
  'DM Sans', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins',
  'Playfair Display', 'Merriweather', 'Source Sans Pro', 'Raleway', 'Nunito',
  'Work Sans', 'Space Grotesk', 'Manrope', 'Plus Jakarta Sans', 'Outfit',
  'Figtree', 'Sora', 'Urbanist', 'Epilogue', 'Bebas Neue', 'Oswald',
  'Cormorant Garamond', 'Libre Baskerville', 'Lora', 'DM Serif Display',
  'Instrument Serif', 'Syne', 'Archivo Black', 'Abril Fatface',
];

const HEADING_KEYS = ['h1','h2','h3','h4','h5','h6'] as const;
const TEXT_GROUPS = ['headline','body','button','caption','eyebrow'] as const;

const COLOR_TOKENS = [
  ['color_background', 'Background'],
  ['color_foreground', 'Foreground (text)'],
  ['color_primary', 'Primary'],
  ['color_primary_foreground', 'Primary Text'],
  ['color_secondary', 'Secondary'],
  ['color_secondary_foreground', 'Secondary Text'],
  ['color_accent', 'Accent'],
  ['color_accent_foreground', 'Accent Text'],
  ['color_muted', 'Muted'],
  ['color_muted_foreground', 'Muted Text'],
  ['color_border', 'Border'],
  ['color_card', 'Card'],
  ['color_card_foreground', 'Card Text'],
  ['color_destructive', 'Destructive'],
] as const;

// Convert hex -> "h s% l%" string (used by site CSS variables)
const hexToHsl = (hex: string): string | null => {
  const m = hex.replace('#','').match(/^([0-9a-f]{6})$/i);
  if (!m) return null;
  const r = parseInt(m[1].slice(0,2),16)/255;
  const g = parseInt(m[1].slice(2,4),16)/255;
  const b = parseInt(m[1].slice(4,6),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h=0, s=0; const l = (max+min)/2;
  if (max !== min) {
    const d = max-min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    switch(max){
      case r: h = ((g-b)/d + (g<b?6:0)); break;
      case g: h = ((b-r)/d + 2); break;
      case b: h = ((r-g)/d + 4); break;
    }
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s*100)}% ${Math.round(l*100)}%`;
};

const hslToHex = (hsl: string): string => {
  const m = hsl?.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
  if (!m) return '#000000';
  const h = parseFloat(m[1])/360, s = parseFloat(m[2])/100, l = parseFloat(m[3])/100;
  const hue2rgb = (p:number,q:number,t:number) => {
    if (t<0) t+=1; if (t>1) t-=1;
    if (t<1/6) return p+(q-p)*6*t;
    if (t<1/2) return q;
    if (t<2/3) return p+(q-p)*(2/3-t)*6;
    return p;
  };
  let r,g,b;
  if (s===0) { r=g=b=l; }
  else {
    const q = l<0.5 ? l*(1+s) : l+s-l*s;
    const p = 2*l-q;
    r = hue2rgb(p,q,h+1/3); g = hue2rgb(p,q,h); b = hue2rgb(p,q,h-1/3);
  }
  const toHex = (x:number) => Math.round(x*255).toString(16).padStart(2,'0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const DesignAdmin = () => {
  const { toast } = useToast();
  const [tokens, setTokens] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [elements, setElements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: tk }, { data: sec }, { data: el }] = await Promise.all([
      supabase.from('design_tokens').select('*').limit(1).maybeSingle(),
      supabase.from('section_styles').select('*').order('section_key'),
      supabase.from('element_styles').select('*').order('page_route').order('style_id'),
    ]);
    setTokens(tk);
    setSections(sec || []);
    setElements(el || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Push live preview to iframe whenever local state changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !tokens) return;
    const send = () => {
      iframe.contentWindow?.postMessage({
        type: 'design_preview', tokens, sections, elements,
      }, '*');
    };
    // Small delay so iframe is ready
    const t = setTimeout(send, 100);
    return () => clearTimeout(t);
  }, [tokens, sections, elements]);

  const onIframeLoad = () => {
    iframeRef.current?.contentWindow?.postMessage({
      type: 'design_preview', tokens, sections, elements,
    }, '*');
  };

  const update = (field: string, value: any) => setTokens((p:any) => ({ ...p, [field]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const { id, created_at, updated_at, ...rest } = tokens || {};
      const { error } = await supabase.from('design_tokens').update(rest).eq('id', id);
      if (error) throw error;
      toast({ title: 'Design saved' });
    } catch (e:any) {
      toast({ title: 'Error saving', description: e.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const updateSection = (idx: number, field: string, value: any) =>
    setSections(prev => prev.map((r,i) => i===idx ? { ...r, [field]: value } : r));

  const addSection = async () => {
    const key = prompt('Section key (e.g. "hero", "about"):');
    if (!key) return;
    const { data, error } = await supabase.from('section_styles').insert({ section_key: key }).select().single();
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    setSections(prev => [...prev, data]);
  };
  const saveSection = async (row: any) => {
    const { id, created_at, updated_at, ...rest } = row;
    const { error } = await supabase.from('section_styles').update(rest).eq('id', id);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    toast({ title: 'Section saved' });
  };
  const deleteSection = async (id: string) => {
    if (!confirm('Delete this section style?')) return;
    await supabase.from('section_styles').delete().eq('id', id);
    setSections(prev => prev.filter(r => r.id !== id));
  };

  const addElement = async () => {
    const styleId = prompt('Element style id (e.g. "hero-headline"):');
    if (!styleId) return;
    const route = prompt('Page route (e.g. "/" or "*" for all):', '*') || '*';
    const { data, error } = await supabase.from('element_styles').insert({ style_id: styleId, page_route: route }).select().single();
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    setElements(prev => [...prev, data]);
  };
  const updateElement = (idx:number, field:string, value:any) =>
    setElements(prev => prev.map((r,i) => i===idx ? { ...r, [field]: value } : r));
  const saveElement = async (row:any) => {
    const { id, created_at, updated_at, ...rest } = row;
    const { error } = await supabase.from('element_styles').update(rest).eq('id', id);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    toast({ title: 'Element saved' });
  };
  const deleteElement = async (id:string) => {
    if (!confirm('Delete this element style?')) return;
    await supabase.from('element_styles').delete().eq('id', id);
    setElements(prev => prev.filter(r => r.id !== id));
  };

  if (loading) return <div className="flex items-center justify-center p-12"><Loader2 className="animate-spin" /></div>;
  if (!tokens) return <p>No design tokens row found.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Design System</h1>
          <p className="text-sm text-muted-foreground">Control typography, colors, and spacing across the entire site. Changes preview live; click Save to publish.</p>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</> : 'Save & Publish'}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,560px)] gap-4">
        {/* CONTROLS */}
        <Tabs defaultValue="typography" className="space-y-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="spacing">Spacing</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="elements">Elements</TabsTrigger>
          </TabsList>

          {/* ----- TYPOGRAPHY ----- */}
          <TabsContent value="typography" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Fonts</CardTitle></CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                {([
                  ['font_heading','Headings font'],
                  ['font_body','Body font'],
                  ['font_button','Buttons font (optional)'],
                  ['font_caption','Captions font (optional)'],
                  ['font_eyebrow','Eyebrow font (optional)'],
                ] as const).map(([k, label]) => (
                  <div key={k}>
                    <Label>{label}</Label>
                    <Select value={tokens[k] || ''} onValueChange={v => update(k, v)}>
                      <SelectTrigger><SelectValue placeholder="Choose font" /></SelectTrigger>
                      <SelectContent>
                        {GOOGLE_FONTS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input className="mt-1" placeholder="Or type a custom font name" value={tokens[k] || ''} onChange={e => update(k, e.target.value)} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {HEADING_KEYS.map(h => (
              <Card key={h}>
                <CardHeader><CardTitle className="uppercase">{h}</CardTitle></CardHeader>
                <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div><Label>Size</Label><Input value={tokens[`${h}_size`] || ''} onChange={e => update(`${h}_size`, e.target.value)} placeholder="e.g. 2rem" /></div>
                  <div><Label>Weight</Label><Input type="number" value={tokens[`${h}_weight`] || ''} onChange={e => update(`${h}_weight`, parseInt(e.target.value)||null)} /></div>
                  <div><Label>Line height</Label><Input value={tokens[`${h}_line_height`] || ''} onChange={e => update(`${h}_line_height`, e.target.value)} /></div>
                  <div><Label>Letter spacing</Label><Input value={tokens[`${h}_letter_spacing`] || ''} onChange={e => update(`${h}_letter_spacing`, e.target.value)} /></div>
                  <div><Label>Color</Label><Input value={tokens[`${h}_color`] || ''} onChange={e => update(`${h}_color`, e.target.value)} placeholder="#000 or hsl(...)" /></div>
                </CardContent>
              </Card>
            ))}

            {TEXT_GROUPS.map(g => (
              <Card key={g}>
                <CardHeader>
                  <CardTitle className="capitalize">{g}</CardTitle>
                  {g === 'eyebrow' && (
                    <p className="text-xs text-muted-foreground">Small label text shown above headings. Apply by adding the class <code>eyebrow</code> or <code>data-style-id="eyebrow"</code>.</p>
                  )}
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div><Label>Size</Label><Input value={tokens[`${g}_size`] || ''} onChange={e => update(`${g}_size`, e.target.value)} /></div>
                  <div><Label>Weight</Label><Input type="number" value={tokens[`${g}_weight`] || ''} onChange={e => update(`${g}_weight`, parseInt(e.target.value)||null)} /></div>
                  <div><Label>Line height</Label><Input value={tokens[`${g}_line_height`] || ''} onChange={e => update(`${g}_line_height`, e.target.value)} /></div>
                  <div><Label>Letter spacing</Label><Input value={tokens[`${g}_letter_spacing`] || ''} onChange={e => update(`${g}_letter_spacing`, e.target.value)} /></div>
                  <div><Label>Color</Label><Input value={tokens[`${g}_color`] || ''} onChange={e => update(`${g}_color`, e.target.value)} /></div>
                  {g === 'eyebrow' && (
                    <div>
                      <Label>Text transform</Label>
                      <Select value={tokens.eyebrow_text_transform || ''} onValueChange={v => update('eyebrow_text_transform', v || null)}>
                        <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">none</SelectItem>
                          <SelectItem value="uppercase">UPPERCASE</SelectItem>
                          <SelectItem value="lowercase">lowercase</SelectItem>
                          <SelectItem value="capitalize">Capitalize</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader><CardTitle>Links</CardTitle></CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-3">
                <div><Label>Link color</Label><Input value={tokens.link_color || ''} onChange={e => update('link_color', e.target.value)} /></div>
                <div><Label>Link hover color</Label><Input value={tokens.link_hover_color || ''} onChange={e => update('link_hover_color', e.target.value)} /></div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ----- COLORS ----- */}
          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <CardTitle>Color Palette</CardTitle>
                <p className="text-xs text-muted-foreground">Colors apply globally to the site. Pick with the swatch or type an HSL string (e.g. "0 0% 0%").</p>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                {COLOR_TOKENS.map(([key, label]) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        className="w-12 h-10 rounded border"
                        value={hslToHex(tokens[key] || '')}
                        onChange={e => {
                          const hsl = hexToHsl(e.target.value);
                          if (hsl) update(key, hsl);
                        }}
                      />
                      <Input value={tokens[key] || ''} onChange={e => update(key, e.target.value)} placeholder="0 0% 0%" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ----- SPACING ----- */}
          <TabsContent value="spacing">
            <Card>
              <CardHeader><CardTitle>Spacing & Layout</CardTitle></CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-3">
                <div><Label>Default section vertical padding</Label><Input value={tokens.section_padding_y || ''} onChange={e => update('section_padding_y', e.target.value)} placeholder="e.g. 4rem" /></div>
                <div><Label>Container max width</Label><Input value={tokens.container_max_width || ''} onChange={e => update('container_max_width', e.target.value)} /></div>
                <div><Label>Radius (base)</Label><Input value={tokens.radius_base || ''} onChange={e => update('radius_base', e.target.value)} /></div>
                <div><Label>Radius (large)</Label><Input value={tokens.radius_lg || ''} onChange={e => update('radius_lg', e.target.value)} /></div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ----- SECTIONS ----- */}
          <TabsContent value="sections" className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Override spacing, background, and alignment per section. Built-in keys: <code>header</code>, <code>footer</code>, <code>navigation</code>, <code>card</code>, <code>form</code>, <code>button</code>, <code>hero</code>, <code>about</code>, <code>programmes</code>. Or use any custom <code>data-section</code> value.</p>
              <Button size="sm" onClick={addSection}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>
            {sections.map((r, idx) => (
              <Card key={r.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{r.section_key}</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveSection(r)}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteSection(r.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-3 gap-3">
                  {(['padding_top','padding_bottom','padding_x','margin_top','margin_bottom','max_width','gap','background_color','text_align'] as const).map(f => (
                    <div key={f}><Label className="capitalize">{f.replace('_',' ')}</Label><Input value={r[f] || ''} onChange={e => updateSection(idx, f, e.target.value)} /></div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* ----- ELEMENTS ----- */}
          <TabsContent value="elements" className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Override styling for individual elements tagged with a <code>data-style-id</code>. Common ids: <code>hero-headline</code>, <code>hero-subheadline</code>, <code>hero-cta</code>, <code>section-heading</code>, <code>footer-text</code>.</p>
              <Button size="sm" onClick={addElement}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>
            {elements.map((r, idx) => (
              <Card key={r.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{r.style_id} <span className="text-xs text-muted-foreground">({r.page_route} · {r.breakpoint})</span></CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveElement(r)}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteElement(r.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-3 gap-3">
                  <div><Label>Breakpoint</Label>
                    <Select value={r.breakpoint || 'base'} onValueChange={v => updateElement(idx, 'breakpoint', v)}>
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="base">All sizes</SelectItem>
                        <SelectItem value="md">≥ 768px</SelectItem>
                        <SelectItem value="lg">≥ 1024px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(['font_family','font_size','font_weight','font_color','line_height','letter_spacing','text_align','text_transform','padding_top','padding_bottom','padding_left','padding_right','margin_top','margin_bottom','background_color'] as const).map(f => (
                    <div key={f}><Label className="capitalize text-xs">{f.replace(/_/g,' ')}</Label><Input value={r[f] ?? ''} onChange={e => updateElement(idx, f, e.target.value)} /></div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* LIVE PREVIEW */}
        <div className="space-y-2 xl:sticky xl:top-4 xl:self-start">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Live preview</Label>
            <Button size="sm" variant="outline" onClick={() => iframeRef.current?.contentWindow?.location.reload()}>Refresh</Button>
          </div>
          <div className="rounded-lg overflow-hidden border bg-background" style={{ aspectRatio: '9 / 16', maxHeight: '85vh' }}>
            <iframe
              ref={iframeRef}
              src="/"
              onLoad={onIframeLoad}
              className="w-full h-full"
              title="Live preview"
            />
          </div>
          <p className="text-xs text-muted-foreground">Changes preview here instantly. Click Save & Publish to apply site-wide.</p>
        </div>
      </div>
    </div>
  );
};

export default DesignAdmin;
