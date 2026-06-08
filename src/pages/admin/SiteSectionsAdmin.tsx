import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PAGE_SCHEMAS, getSectionSchema, type SectionField } from '@/lib/sectionSchemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { GalleryPicker } from '@/components/admin/GalleryPicker';
import { Loader2, Pencil, Eye, EyeOff, RefreshCw, Monitor, Smartphone, X } from 'lucide-react';

type Row = {
  id?: string;
  page_key: string;
  section_key: string;
  content: Record<string, any>;
  is_visible: boolean;
};

const PAGE_ROUTES: Record<string, string> = {
  home: '/',
  about: '/about',
  contact: '/contact',
  'join-us': '/join-us',
  programs: '/programs',
  resources: '/resources',
  gallery: '/gallery',
};

const SiteSectionsAdmin = () => {
  const { toast } = useToast();
  const { can } = usePermissions();
  const canUpdate = can('sections', 'update');

  const [activePage, setActivePage] = useState(PAGE_SCHEMAS[0].key);
  const [rows, setRows] = useState<Record<string, Row>>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ pageKey: string; sectionKey: string } | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(true);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('section_content')
      .select('id, page_key, section_key, content, is_visible');
    if (error) {
      toast({ title: 'Failed to load', description: error.message, variant: 'destructive' });
    }
    const map: Record<string, Row> = {};
    (data ?? []).forEach((r: any) => {
      map[`${r.page_key}::${r.section_key}`] = r;
    });
    setRows(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const page = useMemo(() => PAGE_SCHEMAS.find(p => p.key === activePage)!, [activePage]);
  const previewRoute = PAGE_ROUTES[activePage] ?? '/';

  // Push live overrides to the preview iframe whenever the form changes.
  const postPreview = (content: Record<string, any>) => {
    if (!editing) return;
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage({
      type: 'lovable-section-preview',
      pageKey: editing.pageKey,
      sectionKey: editing.sectionKey,
      content,
      isVisible: true,
    }, '*');
  };

  // Listen for iframe ready signals and replay current edits.
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const m = e.data;
      if (!m || m.type !== 'lovable-section-preview-ready') return;
      if (editing && m.pageKey === editing.pageKey && m.sectionKey === editing.sectionKey) {
        postPreview(form);
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [editing, form]);

  // Re-push overrides when iframe loads or edit target changes.
  useEffect(() => {
    if (editing) postPreview(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing?.pageKey, editing?.sectionKey, iframeKey]);

  const upsert = async (pageKey: string, sectionKey: string, patch: Partial<Row>) => {
    const schema = getSectionSchema(pageKey, sectionKey);
    const existing = rows[`${pageKey}::${sectionKey}`];
    const payload: Row = {
      page_key: pageKey,
      section_key: sectionKey,
      content: patch.content ?? existing?.content ?? schema?.defaults ?? {},
      is_visible: patch.is_visible ?? existing?.is_visible ?? true,
    };
    const { data, error } = await supabase
      .from('section_content')
      .upsert(payload, { onConflict: 'page_key,section_key' })
      .select()
      .maybeSingle();
    if (error) throw error;
    setRows(prev => ({ ...prev, [`${pageKey}::${sectionKey}`]: data as any }));
  };

  const openEdit = (sectionKey: string) => {
    const schema = getSectionSchema(activePage, sectionKey)!;
    const row = rows[`${activePage}::${sectionKey}`];
    setEditing({ pageKey: activePage, sectionKey });
    const initial = { ...schema.defaults, ...(row?.content ?? {}) };
    setForm(initial);
    // No iframe remount here — overrides replay on the existing iframe.
  };

  const onFieldChange = (key: string, v: any) => {
    setForm(prev => {
      const next = { ...prev, [key]: v };
      postPreview(next);
      return next;
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await upsert(editing.pageKey, editing.sectionKey, { content: form });
      toast({ title: 'Section saved' });
      setEditing(null);
      setIframeKey(k => k + 1); // refresh preview to load saved data
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = async (sectionKey: string, visible: boolean) => {
    try {
      await upsert(activePage, sectionKey, { is_visible: visible });
      setIframeKey(k => k + 1);
    } catch (e: any) {
      toast({ title: 'Update failed', description: e.message, variant: 'destructive' });
    }
  };

  const editingSchema = editing ? getSectionSchema(editing.pageKey, editing.sectionKey) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Site Sections</h1>
          <p className="text-sm text-muted-foreground">Edit copy, images, CTAs and visibility for every section across the public site.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPreviewOpen(o => !o)}>
            {previewOpen ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {previewOpen ? 'Hide preview' : 'Show preview'}
          </Button>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      <div className={`grid gap-6 ${previewOpen ? 'grid-cols-1 xl:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)]' : 'grid-cols-1 lg:grid-cols-[200px_1fr]'}`}>
        {/* Pages sidebar */}
        <nav className="space-y-1">
          {PAGE_SCHEMAS.map(p => (
            <button
              key={p.key}
              onClick={() => setActivePage(p.key)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePage === p.key ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
              }`}
            >
              {p.label}
            </button>
          ))}
        </nav>

        {/* Sections grid */}
        <div className="space-y-4 min-w-0">
          {page.sections.map(section => {
            const row = rows[`${activePage}::${section.key}`];
            const visible = row?.is_visible ?? true;
            return (
              <Card key={section.key}>
                <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
                  <div className="min-w-0">
                    <CardTitle className="text-lg">{section.label}</CardTitle>
                    {section.description && (
                      <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                    )}
                    {section.managedElsewhere && (
                      <p className="text-sm text-amber-600 mt-2">{section.managedElsewhere}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {!section.managedElsewhere && (
                      <div className="flex items-center gap-2">
                        {visible ? <Eye size={16} className="text-muted-foreground" /> : <EyeOff size={16} className="text-muted-foreground" />}
                        <Switch checked={visible} disabled={!canUpdate} onCheckedChange={(v) => toggleVisibility(section.key, v)} />
                      </div>
                    )}
                    {!section.managedElsewhere && (
                      <Button size="sm" variant="outline" onClick={() => openEdit(section.key)} disabled={!canUpdate}>
                        <Pencil size={14} className="mr-2" /> Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                {!section.managedElsewhere && (
                  <CardContent className="pt-0 text-sm text-muted-foreground">
                    {section.fields.slice(0, 2).map(f => {
                      const v = row?.content?.[f.key] ?? section.defaults[f.key];
                      if (!v) return null;
                      const preview = typeof v === 'string' ? v : JSON.stringify(v);
                      return (
                        <div key={f.key} className="truncate"><span className="font-medium text-foreground">{f.label}:</span> {String(preview).slice(0, 140)}</div>
                      );
                    })}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Live preview */}
        {previewOpen && (
          <div className="min-w-0">
            <Card className="sticky top-4">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
                <CardTitle className="text-base">Live preview</CardTitle>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant={previewDevice === 'desktop' ? 'default' : 'outline'} onClick={() => setPreviewDevice('desktop')}>
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant={previewDevice === 'mobile' ? 'default' : 'outline'} onClick={() => setPreviewDevice('mobile')}>
                    <Smartphone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIframeKey(k => k + 1)}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-2 truncate">{previewRoute} {editing && <span className="text-primary">· editing {editingSchema?.label}</span>}</p>
                <div className="border rounded-lg overflow-hidden bg-muted flex justify-center">
                  <iframe
                    key={iframeKey}
                    ref={iframeRef}
                    src={previewRoute}
                    title="Site preview"
                    className="bg-background"
                    style={{
                      width: previewDevice === 'mobile' ? 390 : '100%',
                      height: '70vh',
                      border: 0,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => { if (!saving && !o) setEditing(null); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit: {editingSchema?.label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {editingSchema?.fields.map(field => (
              <FieldEditor
                key={field.key}
                field={field}
                value={form[field.key] ?? ''}
                onChange={(v) => onFieldChange(field.key, v)}
              />
            ))}
            {previewOpen && (
              <p className="text-xs text-muted-foreground">Changes appear instantly in the live preview panel. They are only persisted when you click Save.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</> : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const FieldEditor = ({ field, value, onChange }: { field: SectionField; value: any; onChange: (v: any) => void }) => {
  const id = `field-${field.key}`;
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{field.label}</Label>
      {field.type === 'textarea' || field.type === 'rich_text' ? (
        <Textarea id={id} rows={4} value={value ?? ''} onChange={e => onChange(e.target.value)} />
      ) : field.type === 'image' ? (
        <ImageUpload value={value ?? ''} onChange={onChange} folder="sections" />
      ) : field.type === 'boolean' ? (
        <Switch checked={!!value} onCheckedChange={onChange} />
      ) : field.type === 'datetime' ? (
        <Input id={id} type="datetime-local" value={value ?? ''} onChange={e => onChange(e.target.value)} />
      ) : field.type === 'gallery_item' ? (
        <GalleryPicker mode="single" value={value ?? null} onChange={onChange} />
      ) : field.type === 'gallery_items' ? (
        <GalleryPicker mode="multi" value={Array.isArray(value) ? value : []} onChange={onChange} />
      ) : (
        <Input id={id} type={field.type === 'url' ? 'url' : 'text'} value={value ?? ''} onChange={e => onChange(e.target.value)} />
      )}
      {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
    </div>
  );
};

export default SiteSectionsAdmin;
