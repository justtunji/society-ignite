import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AsyncBoundary } from '@/components/admin/AsyncBoundary';
import { useAsyncResource, withTimeout } from '@/hooks/useAsync';
import { useToast } from '@/hooks/use-toast';
import { adminLog } from '@/lib/adminErrorLog';
import { Plus, Pencil, Trash2, Loader2, RefreshCw } from 'lucide-react';

interface Section {
  id: string;
  page_id: string | null;
  type: string;
  order_index: number;
  data: any;
}

interface Page {
  id: string;
  title: string;
  slug: string;
}

const TIMEOUT = 15_000;

const SectionsAdmin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageId = searchParams.get('pageId') || '';
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Section | null>(null);
  const [form, setForm] = useState<{ type: string; order_index: number; data: string }>({
    type: '', order_index: 0, data: '{}',
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    supabase.from('pages').select('id,title,slug').order('title').then(({ data }) => {
      setPages((data ?? []) as Page[]);
    });
  }, []);

  const loader = useCallback(async () => {
    let q = supabase.from('sections').select('*').order('order_index', { ascending: true });
    if (pageId) q = q.eq('page_id', pageId);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as Section[];
  }, [pageId]);

  const { data, status, error, refetch, setData } = useAsyncResource<Section[]>(loader, [loader], TIMEOUT);
  const list = data ?? [];

  const openCreate = () => {
    setEditing(null);
    setForm({ type: '', order_index: list.length, data: '{}' });
    setDialogOpen(true);
  };

  const openEdit = (s: Section) => {
    setEditing(s);
    setForm({
      type: s.type,
      order_index: s.order_index ?? 0,
      data: JSON.stringify(s.data ?? {}, null, 2),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (saving) return;
    let parsed: any = {};
    try { parsed = form.data ? JSON.parse(form.data) : {}; }
    catch { toast({ title: 'Invalid JSON in Data field', variant: 'destructive' }); return; }
    if (!form.type) { toast({ title: 'Type is required', variant: 'destructive' }); return; }

    const payload: any = {
      type: form.type,
      order_index: Number(form.order_index) || 0,
      data: parsed,
      page_id: pageId || null,
    };

    setSaving(true);
    try {
      const op = editing
        ? supabase.from('sections').update(payload).eq('id', editing.id)
        : supabase.from('sections').insert(payload);
      const { error: opError } = await withTimeout<any>(op as any, TIMEOUT, 'save');
      if (opError) throw opError;
      toast({ title: editing ? 'Section updated' : 'Section created' });
      setDialogOpen(false);
      refetch();
    } catch (err: any) {
      adminLog.push({ label: editing ? 'update' : 'insert', scope: 'sections', status: 'error', message: err?.message, code: err?.code, details: err?.details, hint: err?.hint });
      toast({ title: 'Save failed', description: err?.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error: delError } = await withTimeout<any>(
        supabase.from('sections').delete().eq('id', id) as any, TIMEOUT, 'delete',
      );
      if (delError) throw delError;
      setData(list.filter(s => s.id !== id));
      toast({ title: 'Deleted' });
    } catch (err: any) {
      adminLog.push({ label: 'delete', scope: 'sections', status: 'error', message: err?.message });
      toast({ title: 'Delete failed', description: err?.message, variant: 'destructive' });
    } finally { setDeletingId(null); }
  };

  const setPageFilter = (id: string) => {
    if (id === '__all__') setSearchParams({});
    else setSearchParams({ pageId: id });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-3xl font-bold">Sections</h1>
        <div className="flex items-center gap-2">
          <Select value={pageId || '__all__'} onValueChange={setPageFilter}>
            <SelectTrigger className="w-[220px]"><SelectValue placeholder="Filter by page" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All pages</SelectItem>
              {pages.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={refetch} disabled={status === 'loading'}>
            <RefreshCw className={`h-4 w-4 mr-2 ${status === 'loading' ? 'animate-spin' : ''}`} />Refresh
          </Button>
          <Button onClick={openCreate}><Plus size={18} className="mr-2" />Add Section</Button>
        </div>
      </div>

      <AsyncBoundary status={status} error={error} onRetry={refetch} loadingLabel="Loading sections…">
        {list.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No sections yet.</CardContent></Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Order</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Page</TableHead>
                    <TableHead>Data Preview</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map(s => {
                    const page = pages.find(p => p.id === s.page_id);
                    const preview = JSON.stringify(s.data ?? {});
                    return (
                      <TableRow key={s.id}>
                        <TableCell>{s.order_index}</TableCell>
                        <TableCell className="font-medium">{s.type}</TableCell>
                        <TableCell className="text-muted-foreground">{page?.title || '—'}</TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-md truncate">{preview.slice(0, 100)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button size="icon" variant="ghost" onClick={() => openEdit(s)}><Pencil size={16} /></Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="icon" variant="ghost" className="text-destructive" disabled={deletingId === s.id}>
                                  {deletingId === s.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete this section?</AlertDialogTitle>
                                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(s.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </AsyncBoundary>

      <Dialog open={dialogOpen} onOpenChange={(o) => { if (!saving) setDialogOpen(o); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Section</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Type *</Label>
              <Input value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} placeholder="hero, cta, gallery, …" />
            </div>
            <div className="space-y-1">
              <Label>Order</Label>
              <Input type="number" value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="space-y-1">
              <Label>Data (JSON)</Label>
              <Textarea rows={10} className="font-mono text-xs" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} />
              <p className="text-xs text-muted-foreground">Free-form JSON. Use this to drive your section component (headline, image URLs, items, …).</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</> : (editing ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SectionsAdmin;
