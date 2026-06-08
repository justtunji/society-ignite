import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { cldUrl } from '@/lib/cloudinary';
import { ArrowUp, ArrowDown, Eye, EyeOff, X, Plus, Loader2 } from 'lucide-react';

interface GalleryItemRow {
  id: string;
  title: string;
  image_url: string;
  category: string | null;
}

export interface CuratedItem { id: string; visible: boolean }

type Props =
  | { mode: 'single'; value: string | null; onChange: (v: string | null) => void }
  | { mode: 'multi'; value: CuratedItem[]; onChange: (v: CuratedItem[]) => void };

export const GalleryPicker = (props: Props) => {
  const [items, setItems] = useState<GalleryItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    supabase
      .from('gallery_items')
      .select('id, title, image_url, category, display_order, visible')
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (cancelled) return;
        setItems((data ?? []) as GalleryItemRow[]);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const byId = useMemo(() => new Map(items.map(i => [i.id, i])), [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i =>
      [i.title, i.category].filter(Boolean).join(' ').toLowerCase().includes(q),
    );
  }, [items, search]);

  // -------- single mode --------
  if (props.mode === 'single') {
    const selected = props.value ? byId.get(props.value) : null;
    return (
      <div className="space-y-2">
        {selected ? (
          <div className="flex items-center gap-3 border rounded-md p-2">
            <img src={cldUrl(selected.image_url, { w: 160, c: 'fill' })} alt="" className="w-16 h-16 rounded object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selected.title}</p>
              {selected.category && <p className="text-xs text-muted-foreground">{selected.category}</p>}
            </div>
            <Button size="sm" variant="ghost" onClick={() => props.onChange(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No gallery item selected — falls back to the uploaded image above.</p>
        )}
        <Button type="button" size="sm" variant="outline" onClick={() => setOpen(true)}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> {selected ? 'Change' : 'Pick from gallery'}
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Pick a gallery item</DialogTitle></DialogHeader>
            <Input placeholder="Search by title or category…" value={search} onChange={e => setSearch(e.target.value)} />
            {loading ? (
              <div className="py-10 flex items-center justify-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
                {filtered.map(i => {
                  const active = props.value === i.id;
                  return (
                    <button
                      key={i.id}
                      type="button"
                      onClick={() => { props.onChange(i.id); setOpen(false); }}
                      className={`relative rounded-lg overflow-hidden border-2 ${active ? 'border-accent' : 'border-transparent'} hover:border-accent/60`}
                    >
                      <img src={cldUrl(i.image_url, { w: 320, c: 'fill', h: 320 })} alt={i.title} className="w-full aspect-square object-cover" />
                      <p className="text-[11px] p-1 truncate bg-background">{i.title}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // -------- multi mode --------
  const value = props.value ?? [];
  const selectedIds = new Set(value.map(v => v.id));

  const move = (idx: number, delta: number) => {
    const next = [...value];
    const newIdx = idx + delta;
    if (newIdx < 0 || newIdx >= next.length) return;
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    props.onChange(next);
  };
  const remove = (id: string) => props.onChange(value.filter(v => v.id !== id));
  const toggleVisible = (id: string) =>
    props.onChange(value.map(v => v.id === id ? { ...v, visible: !v.visible } : v));
  const add = (id: string) => {
    if (selectedIds.has(id)) return;
    props.onChange([...value, { id, visible: true }]);
  };

  return (
    <div className="space-y-2">
      {value.length === 0 ? (
        <p className="text-xs text-muted-foreground">No curated items — the grid shows every visible gallery item ordered by display order.</p>
      ) : (
        <ul className="border rounded-md divide-y">
          {value.map((entry, idx) => {
            const item = byId.get(entry.id);
            if (!item) return (
              <li key={entry.id} className="flex items-center gap-2 p-2 text-xs text-muted-foreground">
                <span className="flex-1">Missing item ({entry.id.slice(0, 8)}…)</span>
                <Button size="sm" variant="ghost" onClick={() => remove(entry.id)}><X className="h-4 w-4" /></Button>
              </li>
            );
            return (
              <li key={entry.id} className="flex items-center gap-2 p-2">
                <img src={cldUrl(item.image_url, { w: 96, c: 'fill', h: 96 })} alt="" className="w-10 h-10 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{item.title}</p>
                  {item.category && <p className="text-[11px] text-muted-foreground">{item.category}</p>}
                </div>
                <div className="flex items-center gap-1">
                  {entry.visible ? <Eye size={14} className="text-muted-foreground" /> : <EyeOff size={14} className="text-muted-foreground" />}
                  <Switch checked={entry.visible} onCheckedChange={() => toggleVisible(entry.id)} />
                </div>
                <Button size="sm" variant="ghost" disabled={idx === 0} onClick={() => move(idx, -1)}><ArrowUp className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" disabled={idx === value.length - 1} onClick={() => move(idx, 1)}><ArrowDown className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => remove(entry.id)}><X className="h-4 w-4" /></Button>
              </li>
            );
          })}
        </ul>
      )}
      <Button type="button" size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Plus className="h-3.5 w-3.5 mr-1.5" /> Add gallery items
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add gallery items</DialogTitle></DialogHeader>
          <Input placeholder="Search by title or category…" value={search} onChange={e => setSearch(e.target.value)} />
          {loading ? (
            <div className="py-10 flex items-center justify-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
              {filtered.map(i => {
                const active = selectedIds.has(i.id);
                return (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => active ? remove(i.id) : add(i.id)}
                    className={`relative rounded-lg overflow-hidden border-2 ${active ? 'border-accent' : 'border-transparent'} hover:border-accent/60`}
                  >
                    <img src={cldUrl(i.image_url, { w: 320, c: 'fill', h: 320 })} alt={i.title} className="w-full aspect-square object-cover" />
                    {active && (
                      <span className="absolute top-1 right-1 bg-accent text-accent-foreground text-[10px] font-semibold rounded-full px-2 py-0.5">
                        Added
                      </span>
                    )}
                    <p className="text-[11px] p-1 truncate bg-background">{i.title}</p>
                  </button>
                );
              })}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
