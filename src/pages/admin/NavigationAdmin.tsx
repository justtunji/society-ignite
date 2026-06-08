import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AsyncBoundary } from '@/components/admin/AsyncBoundary';
import { useToast } from '@/hooks/use-toast';
import { useAsyncResource } from '@/hooks/useAsync';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  url: string;
  external: boolean | null;
  order_index: number | null;
  parent_id: string | null;
  visible: boolean | null;
  cta_style: boolean | null;
}

const emptyForm = {
  label: '',
  url: '',
  external: false,
  order_index: 0,
  parent_id: null as string | null,
  visible: true,
  cta_style: false,
};

const NavigationAdmin = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NavItem | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);

  const loader = useCallback(async () => {
    const { data, error } = await supabase
      .from('navigation_items')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) throw error;
    return (data ?? []) as NavItem[];
  }, []);

  const { data: items, status, error, refetch } = useAsyncResource<NavItem[]>(loader, [loader], 15000);
  const list = items ?? [];
  const topLevel = list.filter(i => !i.parent_id);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };
  const openEdit = (item: NavItem) => {
    setEditing(item);
    setForm({
      label: item.label,
      url: item.url,
      external: !!item.external,
      order_index: item.order_index ?? 0,
      parent_id: item.parent_id,
      visible: item.visible ?? true,
      cta_style: !!item.cta_style,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.label || !form.url) {
      toast({ title: 'Label and URL are required', variant: 'destructive' });
      return;
    }
    const payload = { ...form, parent_id: form.parent_id || null };
    const op = editing
      ? supabase.from('navigation_items').update(payload).eq('id', editing.id)
      : supabase.from('navigation_items').insert(payload as any);
    const { error: err } = await op;
    if (err) {
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' });
      return;
    }
    toast({ title: editing ? 'Updated' : 'Created' });
    setOpen(false);
    refetch();
  };

  const remove = async (id: string) => {
    const { error: err } = await supabase.from('navigation_items').delete().eq('id', id);
    if (err) {
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Deleted' });
    refetch();
  };

  const reorder = async (item: NavItem, dir: -1 | 1) => {
    const peers = list
      .filter(i => (i.parent_id ?? null) === (item.parent_id ?? null))
      .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
    const idx = peers.findIndex(i => i.id === item.id);
    const neighbour = peers[idx + dir];
    if (!neighbour) return;
    const a = item.order_index ?? 0;
    const b = neighbour.order_index ?? 0;
    const swap = a === b ? a + dir : b;
    await Promise.all([
      supabase.from('navigation_items').update({ order_index: swap }).eq('id', item.id),
      supabase.from('navigation_items').update({ order_index: a }).eq('id', neighbour.id),
    ]);
    refetch();
  };

  // Build display rows: top-level then children indented
  const rows: { item: NavItem; depth: number }[] = [];
  topLevel
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
    .forEach(parent => {
      rows.push({ item: parent, depth: 0 });
      list
        .filter(c => c.parent_id === parent.id)
        .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
        .forEach(child => rows.push({ item: child, depth: 1 }));
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Navigation</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage the site header menu. Items with a parent appear as a dropdown sub-menu under that parent.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" />Refresh
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew}><Plus size={18} className="mr-2" />Add Item</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit' : 'Add'} navigation item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1">
                  <Label>Label *</Label>
                  <Input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="e.g. About" />
                </div>
                <div className="space-y-1">
                  <Label>URL *</Label>
                  <Input
                    value={form.url}
                    onChange={e => setForm({ ...form, url: e.target.value })}
                    placeholder="/about or https://example.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use a path like <code>/about</code> for internal pages (including CMS pages built on the Pages screen),
                    or a full <code>https://…</code> URL for external links.
                  </p>
                </div>
                <div className="space-y-1">
                  <Label>Parent (sub-menu of)</Label>
                  <Select
                    value={form.parent_id ?? 'none'}
                    onValueChange={v => setForm({ ...form, parent_id: v === 'none' ? null : v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">— None (top-level menu item)</SelectItem>
                      {topLevel
                        .filter(p => !editing || p.id !== editing.id)
                        .map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Pick a top-level item to make this a dropdown entry under it. Leave as “None” to show it directly in the main menu.
                  </p>
                </div>
                <div className="space-y-1">
                  <Label>Order</Label>
                  <Input
                    type="number"
                    value={form.order_index}
                    onChange={e => setForm({ ...form, order_index: parseInt(e.target.value || '0', 10) })}
                  />
                  <p className="text-xs text-muted-foreground">Lower numbers appear first.</p>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Open in new tab (external)</Label>
                  <Switch checked={form.external} onCheckedChange={v => setForm({ ...form, external: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show as call-to-action button</Label>
                  <Switch checked={form.cta_style} onCheckedChange={v => setForm({ ...form, cta_style: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Visible</Label>
                  <Switch checked={form.visible} onCheckedChange={v => setForm({ ...form, visible: v })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={save}>{editing ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <AsyncBoundary status={status} error={error} onRetry={refetch} loadingLabel="Loading navigation…">
        {rows.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No items yet.</CardContent></Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Label</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Visible</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map(({ item, depth }) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <span style={{ paddingLeft: depth * 20 }}>
                          {depth > 0 && <span className="text-muted-foreground mr-2">↳</span>}
                          {item.label}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{item.url}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {depth > 0 ? 'Sub-menu' : item.cta_style ? 'CTA button' : 'Menu'}
                        {item.external ? ' · external' : ''}
                      </TableCell>
                      <TableCell>{item.visible ? '✅' : '—'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" onClick={() => reorder(item, -1)} aria-label="Move up"><ArrowUp size={16} /></Button>
                          <Button size="icon" variant="ghost" onClick={() => reorder(item, 1)} aria-label="Move down"><ArrowDown size={16} /></Button>
                          <Button size="icon" variant="ghost" onClick={() => openEdit(item)} aria-label="Edit"><Pencil size={16} /></Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="text-destructive" aria-label="Delete"><Trash2 size={16} /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this menu item?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove it from the site header. Sub-menu items under it will also be detached.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => remove(item.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
    </div>
  );
};

export default NavigationAdmin;
