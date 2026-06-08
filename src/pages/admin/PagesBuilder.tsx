import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAsyncResource, withTimeout } from '@/hooks/useAsync';
import { AsyncBoundary } from '@/components/admin/AsyncBoundary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';
import { BLOCK_LABELS, createBlock, type BlockType, type PageBlock } from '@/lib/pageBlocks';
import PageBlockRenderer from '@/components/PageBlockRenderer';
import {
  Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, Eye, Pencil, RefreshCw, Loader2,
} from 'lucide-react';

interface PageRow {
  id: string;
  slug: string;
  title: string;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  status: 'draft' | 'published';
  blocks: PageBlock[];
  updated_at: string;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const PagesBuilder = () => {
  const { toast } = useToast();
  const { can } = usePermissions();
  const canCreate = can('pages', 'create');
  const canUpdate = can('pages', 'update');
  const canDelete = can('pages', 'delete');

  const loader = useCallback(async () => {
    const { data, error } = await supabase
      .from('cms_pages').select('*').order('updated_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as PageRow[];
  }, []);

  const { data: pages, status, error, refetch } = useAsyncResource<PageRow[]>(loader, [loader], 15000);
  const list = pages ?? [];

  const [editing, setEditing] = useState<PageRow | null>(null);
  const [preview, setPreview] = useState<PageRow | null>(null);
  const [saving, setSaving] = useState(false);

  const startNew = () => {
    setEditing({
      id: '', slug: '', title: 'Untitled page',
      seo_title: '', seo_description: '', og_image_url: '',
      status: 'draft', blocks: [], updated_at: new Date().toISOString(),
    });
  };

  const startEdit = (p: PageRow) => {
    setEditing({ ...p, blocks: Array.isArray(p.blocks) ? [...p.blocks] : [] });
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.title.trim()) { toast({ title: 'Title required', variant: 'destructive' }); return; }
    const slug = editing.slug.trim() || slugify(editing.title);
    if (!slug) { toast({ title: 'Slug required', variant: 'destructive' }); return; }

    setSaving(true);
    try {
      const payload = {
        slug,
        title: editing.title.trim(),
        seo_title: editing.seo_title || null,
        seo_description: editing.seo_description || null,
        og_image_url: editing.og_image_url || null,
        status: editing.status,
        blocks: editing.blocks,
      };
      const op = editing.id
        ? supabase.from('cms_pages').update(payload).eq('id', editing.id)
        : supabase.from('cms_pages').insert(payload);
      const { error: err } = await withTimeout<any>(op as any, 15000, 'save page');
      if (err) throw err;
      toast({ title: editing.id ? 'Page updated' : 'Page created' });
      setEditing(null);
      refetch();
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    const { error: err } = await supabase.from('cms_pages').delete().eq('id', id);
    if (err) { toast({ title: 'Delete failed', description: err.message, variant: 'destructive' }); return; }
    toast({ title: 'Page deleted' });
    refetch();
  };

  const addBlock = (type: BlockType) => {
    setEditing((e) => e ? { ...e, blocks: [...e.blocks, createBlock(type)] } : e);
  };
  const updateBlock = (idx: number, patch: Partial<PageBlock>) => {
    setEditing((e) => {
      if (!e) return e;
      const blocks = e.blocks.map((b, i) => i === idx ? { ...b, ...patch } as PageBlock : b);
      return { ...e, blocks };
    });
  };
  const moveBlock = (idx: number, dir: -1 | 1) => {
    setEditing((e) => {
      if (!e) return e;
      const target = idx + dir;
      if (target < 0 || target >= e.blocks.length) return e;
      const blocks = [...e.blocks];
      [blocks[idx], blocks[target]] = [blocks[target], blocks[idx]];
      return { ...e, blocks };
    });
  };
  const removeBlock = (idx: number) => {
    setEditing((e) => e ? { ...e, blocks: e.blocks.filter((_, i) => i !== idx) } : e);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-sm text-muted-foreground">
            Build content pages with reusable blocks. Published pages are live at <code>/your-slug</code>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          {canCreate && (
            <Button onClick={startNew}><Plus size={18} className="mr-2" />New page</Button>
          )}
        </div>
      </div>

      <AsyncBoundary status={status} error={error} onRetry={refetch} loadingLabel="Loading pages…">
        {list.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">
            No pages yet. {canCreate ? 'Click "New page" to start building.' : 'Ask an admin to grant Create permission.'}
          </CardContent></Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Blocks</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell><code className="text-xs">/{p.slug}</code></TableCell>
                      <TableCell>
                        <Badge variant={p.status === 'published' ? 'default' : 'outline'}>{p.status}</Badge>
                      </TableCell>
                      <TableCell>{(p.blocks ?? []).length}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(p.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-1">
                          {p.status === 'published' && (
                            <Button size="icon" variant="ghost" asChild title="Open">
                              <a href={`/${p.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /></a>
                            </Button>
                          )}
                          <Button size="icon" variant="ghost" title="Preview" onClick={() => setPreview(p)}>
                            <Eye size={16} />
                          </Button>
                          {canUpdate && (
                            <Button size="icon" variant="ghost" title="Edit" onClick={() => startEdit(p)}>
                              <Pencil size={16} />
                            </Button>
                          )}
                          {canDelete && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="icon" variant="ghost" className="text-destructive"><Trash2 size={16} /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete "{p.title}"?</AlertDialogTitle>
                                  <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => remove(p.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </AsyncBoundary>

      {/* Editor */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && !saving && setEditing(null)}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Edit page' : 'New page'}</DialogTitle>
            <DialogDescription>Compose your page from blocks. Save as draft until you're ready to publish.</DialogDescription>
          </DialogHeader>

          {editing && (
            <div className="space-y-6 py-2">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input value={editing.slug} placeholder="auto-from-title"
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>SEO title</Label>
                  <Input value={editing.seo_title ?? ''} onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label>SEO description</Label>
                  <Textarea value={editing.seo_description ?? ''} onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label>Open Graph image</Label>
                  <ImageUpload value={editing.og_image_url ?? ''} onChange={(v) => setEditing({ ...editing, og_image_url: v })} folder="cms_pages" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Blocks</h3>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(BLOCK_LABELS) as BlockType[]).map((t) => (
                      <Button key={t} size="sm" variant="outline" onClick={() => addBlock(t)}>
                        <Plus size={14} className="mr-1" /> {BLOCK_LABELS[t]}
                      </Button>
                    ))}
                  </div>
                </div>

                {editing.blocks.length === 0 ? (
                  <Card><CardContent className="py-8 text-center text-muted-foreground text-sm">
                    Add your first block above.
                  </CardContent></Card>
                ) : (
                  <div className="space-y-3">
                    {editing.blocks.map((block, idx) => (
                      <BlockEditor
                        key={block.id}
                        block={block}
                        onChange={(patch) => updateBlock(idx, patch)}
                        onMove={(dir) => moveBlock(idx, dir)}
                        onRemove={() => removeBlock(idx)}
                        isFirst={idx === 0}
                        isLast={idx === editing.blocks.length - 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)} disabled={saving}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing?.id ? 'Save changes' : 'Create page'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview — {preview?.title}</DialogTitle>
          </DialogHeader>
          {preview && (
            <div className="border rounded-lg p-4 bg-background">
              <PageBlockRenderer blocks={preview.blocks ?? []} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ---------------- Block editor ---------------- */

interface BlockEditorProps {
  block: PageBlock;
  onChange: (patch: Partial<PageBlock>) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const BlockEditor = ({ block, onChange, onMove, onRemove, isFirst, isLast }: BlockEditorProps) => {
  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Badge variant="secondary">{BLOCK_LABELS[block.type]}</Badge>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" disabled={isFirst} onClick={() => onMove(-1)}><ArrowUp size={16} /></Button>
            <Button size="icon" variant="ghost" disabled={isLast} onClick={() => onMove(1)}><ArrowDown size={16} /></Button>
            <Button size="icon" variant="ghost" className="text-destructive" onClick={onRemove}><Trash2 size={16} /></Button>
          </div>
        </div>

        {block.type === 'hero' && (
          <div className="grid md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <Label>Heading</Label>
              <Input value={block.heading} onChange={(e) => onChange({ heading: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label>Subheading</Label>
              <Textarea value={block.subheading ?? ''} onChange={(e) => onChange({ subheading: e.target.value })} />
            </div>
            <div>
              <Label>CTA label</Label>
              <Input value={block.cta_label ?? ''} onChange={(e) => onChange({ cta_label: e.target.value })} />
            </div>
            <div>
              <Label>CTA URL</Label>
              <Input value={block.cta_url ?? ''} onChange={(e) => onChange({ cta_url: e.target.value })} />
            </div>
            <div>
              <Label>Alignment</Label>
              <Select value={block.align ?? 'left'} onValueChange={(v) => onChange({ align: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Image</Label>
              <ImageUpload value={block.image_url ?? ''} onChange={(v) => onChange({ image_url: v })} folder="cms_pages" />
            </div>
          </div>
        )}

        {block.type === 'rich_text' && (
          <div>
            <Label>Content</Label>
            <RichTextEditor value={block.html} onChange={(v) => onChange({ html: v })} />
          </div>
        )}

        {block.type === 'image' && (
          <div className="grid md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <Label>Image</Label>
              <ImageUpload value={block.image_url} onChange={(v) => onChange({ image_url: v })} folder="cms_pages" />
            </div>
            <div>
              <Label>Alt text</Label>
              <Input value={block.alt ?? ''} onChange={(e) => onChange({ alt: e.target.value })} />
            </div>
            <div>
              <Label>Width</Label>
              <Select value={block.width ?? 'wide'} onValueChange={(v) => onChange({ width: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="narrow">Narrow</SelectItem>
                  <SelectItem value="wide">Wide</SelectItem>
                  <SelectItem value="full">Full width</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Caption</Label>
              <Input value={block.caption ?? ''} onChange={(e) => onChange({ caption: e.target.value })} />
            </div>
          </div>
        )}

        {block.type === 'cta' && (
          <div className="grid md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <Label>Heading</Label>
              <Input value={block.heading} onChange={(e) => onChange({ heading: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label>Supporting text</Label>
              <Textarea value={block.text ?? ''} onChange={(e) => onChange({ text: e.target.value })} />
            </div>
            <div>
              <Label>Button label</Label>
              <Input value={block.button_label} onChange={(e) => onChange({ button_label: e.target.value })} />
            </div>
            <div>
              <Label>Button URL</Label>
              <Input value={block.button_url} onChange={(e) => onChange({ button_url: e.target.value })} />
            </div>
          </div>
        )}

        {block.type === 'gallery' && (
          <GalleryEditor block={block} onChange={onChange} />
        )}

        {block.type === 'embed' && (
          <div>
            <Label>Embed HTML / iframe</Label>
            <Textarea rows={5} value={block.html} onChange={(e) => onChange({ html: e.target.value })}
              placeholder='<iframe src="..." width="100%" height="500" frameborder="0"></iframe>' />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const GalleryEditor = ({ block, onChange }: { block: Extract<PageBlock, { type: 'gallery' }>; onChange: (p: any) => void }) => {
  const images = block.images ?? [];
  const setImg = (i: number, patch: Partial<{ url: string; alt: string }>) => {
    const next = images.map((img, idx) => idx === i ? { ...img, ...patch } : img);
    onChange({ images: next });
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Columns</Label>
        <Select value={String(block.columns ?? 3)} onValueChange={(v) => onChange({ columns: Number(v) })}>
          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        {images.map((img, i) => (
          <div key={i} className="grid md:grid-cols-[1fr_1fr_auto] gap-2 items-start border rounded p-2">
            <ImageUpload value={img.url} onChange={(v) => setImg(i, { url: v })} folder="cms_pages" />
            <Input placeholder="Alt text" value={img.alt ?? ''} onChange={(e) => setImg(i, { alt: e.target.value })} />
            <Button size="icon" variant="ghost" className="text-destructive"
              onClick={() => onChange({ images: images.filter((_, idx) => idx !== i) })}>
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
        <Button size="sm" variant="outline" onClick={() => onChange({ images: [...images, { url: '', alt: '' }] })}>
          <Plus size={14} className="mr-1" /> Add image
        </Button>
      </div>
    </div>
  );
};

export default PagesBuilder;
