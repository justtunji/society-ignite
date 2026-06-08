import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { AsyncBoundary } from '@/components/admin/AsyncBoundary';
import { useToast } from '@/hooks/use-toast';
import { useAsyncResource, withTimeout } from '@/hooks/useAsync';
import { adminLog } from '@/lib/adminErrorLog';
import { Plus, Pencil, Trash2, Loader2, RefreshCw, ArrowUp, ArrowDown } from 'lucide-react';

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'richtext' | 'number' | 'boolean' | 'image' | 'url' | 'date' | 'datetime' | 'tags' | 'select';
  required?: boolean;
  defaultValue?: any;
  showInTable?: boolean;
  options?: { label: string; value: string }[];
}

interface CrudPageProps {
  title: string;
  tableName: string;
  fields: FieldConfig[];
  orderBy?: string;
  orderAsc?: boolean;
  slugField?: boolean;
  customActions?: (item: any) => React.ReactNode;
  /** Enables Up/Down reorder buttons that swap this numeric column with the neighbour. Pair with `groupBy` to scope swaps. */
  reorderField?: string;
  /** Only swap within rows that share this column's value (e.g. 'category'). */
  groupBy?: string;
  /** Permission module key (e.g. 'events'). When set, action buttons are hidden if the user lacks the matching permission. */
  module?: string;
}

const REQUEST_TIMEOUT = 15_000;

const CrudPage = ({ title, tableName, fields, orderBy = 'created_at', orderAsc = false, slugField = true, customActions, reorderField, groupBy, module }: CrudPageProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const tableColumns = fields.filter(f => f.showInTable !== false).slice(0, 5);

  const loader = useCallback(async () => {
    const { data, error } = await supabase
      .from(tableName as any)
      .select('*')
      .order(orderBy, { ascending: orderAsc });
    if (error) throw error;
    return (data ?? []) as any[];
  }, [tableName, orderBy, orderAsc]);

  const { data: items, status, error, refetch, setData } = useAsyncResource<any[]>(loader, [loader], REQUEST_TIMEOUT);
  const list = items ?? [];

  const initForm = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      const defaults: any = {};
      fields.forEach(f => {
        defaults[f.name] = f.defaultValue ?? (f.type === 'boolean' ? false : f.type === 'tags' ? [] : '');
      });
      setFormData(defaults);
    }
    setDialogOpen(true);
  };

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSave = async () => {
    if (saving) return;
    const payload = { ...formData };
    if (slugField && payload.title && !payload.slug) {
      payload.slug = generateSlug(payload.title);
    }
    if (!editingItem) delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;
    // Coerce form values to types the database expects. Empty strings on
    // nullable date/number/array columns cause "invalid input syntax" or
    // "malformed array literal" errors in Postgres.
    fields.forEach((field) => {
      const value = payload[field.name];
      switch (field.type) {
        case 'tags':
          payload[field.name] = Array.isArray(value)
            ? value.map((t: string) => String(t).trim()).filter(Boolean)
            : typeof value === 'string'
              ? value.split(',').map((t) => t.trim()).filter(Boolean)
              : [];
          break;
        case 'number':
          payload[field.name] =
            value === '' || value === null || value === undefined ? null : Number(value);
          break;
        case 'date':
          payload[field.name] = value === '' || value == null ? null : value;
          break;
        case 'datetime': {
          if (value === '' || value == null) {
            payload[field.name] = null;
          } else {
            const d = new Date(value);
            payload[field.name] = isNaN(d.getTime()) ? null : d.toISOString();
          }
          break;
        }
        case 'boolean':
          payload[field.name] = !!value;
          break;
        default:
          // Text-like fields: convert empty strings to null when optional.
          if (value === '' && !field.required) payload[field.name] = null;
          break;
      }
    });

    setSaving(true);
    try {
      const op: Promise<any> = editingItem
        ? (supabase.from(tableName as any).update(payload).eq('id', editingItem.id) as any)
        : (supabase.from(tableName as any).insert(payload as any) as any);
      const { error: opError } = await withTimeout<any>(op, REQUEST_TIMEOUT, 'save');
      if (opError) throw opError;

      toast({ title: editingItem ? 'Updated' : 'Created' });
      setDialogOpen(false);
      refetch();
    } catch (err: any) {
      console.error('[CrudPage save]', err);
      adminLog.push({
        label: editingItem ? 'update' : 'insert',
        scope: tableName,
        status: /timed out/i.test(err?.message || '') ? 'timeout' : 'error',
        message: err?.message || 'Save failed',
        code: err?.code, details: err?.details, hint: err?.hint,
      });
      toast({ title: 'Save failed', description: err?.message || 'Unknown error', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error: delError } = await withTimeout<any>(
        supabase.from(tableName as any).delete().eq('id', id) as any,
        REQUEST_TIMEOUT,
        'delete',
      );
      if (delError) throw delError;
      // Optimistically update list, then refetch.
      setData(list.filter((i: any) => i.id !== id));
      toast({ title: 'Deleted' });
      refetch();
    } catch (err: any) {
      console.error('[CrudPage delete]', err);
      adminLog.push({
        label: 'delete',
        scope: tableName,
        status: /timed out/i.test(err?.message || '') ? 'timeout' : 'error',
        message: err?.message || 'Delete failed',
        code: err?.code, details: err?.details, hint: err?.hint,
      });
      toast({ title: 'Delete failed', description: err?.message || 'Unknown error', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  const updateFormField = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleReorder = async (item: any, dir: -1 | 1) => {
    if (!reorderField) return;
    const peers = groupBy
      ? list.filter((i: any) => (i[groupBy] ?? null) === (item[groupBy] ?? null))
      : list;
    const sorted = [...peers].sort((a, b) => (a[reorderField] ?? 0) - (b[reorderField] ?? 0));
    const idx = sorted.findIndex(i => i.id === item.id);
    const neighbour = sorted[idx + dir];
    if (!neighbour) return;
    const a = item[reorderField] ?? 0;
    const b = neighbour[reorderField] ?? 0;
    const swapVal = a === b ? a + dir : b;
    try {
      await Promise.all([
        supabase.from(tableName as any).update({ [reorderField]: swapVal } as any).eq('id', item.id),
        supabase.from(tableName as any).update({ [reorderField]: a } as any).eq('id', neighbour.id),
      ]);
      refetch();
    } catch (err: any) {
      toast({ title: 'Reorder failed', description: err?.message, variant: 'destructive' });
    }
  };


  const renderField = (field: FieldConfig) => {
    const value = formData[field.name];
    switch (field.type) {
      case 'textarea':
        return <Textarea value={value || ''} onChange={e => updateFormField(field.name, e.target.value)} />;
      case 'richtext':
        return <RichTextEditor value={value || ''} onChange={v => updateFormField(field.name, v)} />;
      case 'number':
        return <Input type="number" value={value ?? ''} onChange={e => updateFormField(field.name, e.target.value === '' ? '' : parseFloat(e.target.value))} />;
      case 'boolean':
        return <Switch checked={!!value} onCheckedChange={v => updateFormField(field.name, v)} />;
      case 'image':
        return <ImageUpload value={value || ''} onChange={v => updateFormField(field.name, v)} folder={tableName} />;
      case 'date':
        return <Input type="date" value={value || ''} onChange={e => updateFormField(field.name, e.target.value)} />;
      case 'datetime':
        return <Input type="datetime-local" value={value ? String(value).slice(0, 16) : ''} onChange={e => updateFormField(field.name, e.target.value)} />;
      case 'tags':
        return <Input value={Array.isArray(value) ? value.join(', ') : value || ''} onChange={e => updateFormField(field.name, e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))} placeholder="Comma-separated tags" />;
      case 'url':
        return <Input type="url" value={value || ''} onChange={e => updateFormField(field.name, e.target.value)} />;
      case 'select':
        return (
          <Select value={value || ''} onValueChange={v => updateFormField(field.name, v)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return <Input value={value || ''} onChange={e => updateFormField(field.name, e.target.value)} required={field.required} />;
    }
  };

  const renderCellValue = (item: any, field: FieldConfig) => {
    const val = item[field.name];
    if (field.type === 'boolean') return val ? '✅' : '❌';
    if (field.type === 'image') return val ? <img src={val} alt="" className="h-10 w-10 object-cover rounded" loading="lazy" /> : '—';
    if (val === null || val === undefined || val === '') return '—';
    if (Array.isArray(val)) return val.join(', ');
    const str = String(val);
    return str.length > 60 ? str.slice(0, 60) + '...' : str;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refetch} disabled={status === 'loading'}>
            <RefreshCw className={`h-4 w-4 mr-2 ${status === 'loading' ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={dialogOpen} onOpenChange={(open) => { if (!saving) setDialogOpen(open); }}>
            <DialogTrigger asChild>
              <Button onClick={() => initForm()}><Plus size={18} className="mr-2" />Add {title.replace(/s$/, '')}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit' : 'Add'} {title.replace(/s$/, '')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {fields.map(field => (
                  <div key={field.name} className={field.type === 'boolean' ? 'flex items-center justify-between' : 'space-y-1'}>
                    <Label>{field.label}{field.required && <span className="text-destructive ml-1">*</span>}</Label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</> : (editingItem ? 'Update' : 'Create')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <AsyncBoundary status={status} error={error} onRetry={refetch} loadingLabel={`Loading ${title.toLowerCase()}…`}>
        {list.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No items yet. Click "Add" to create one.</CardContent></Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {tableColumns.map(f => <TableHead key={f.name}>{f.label}</TableHead>)}
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map(item => (
                    <TableRow key={item.id}>
                      {tableColumns.map(f => (
                        <TableCell key={f.name}>{renderCellValue(item, f)}</TableCell>
                      ))}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {reorderField && (
                            <>
                              <Button size="icon" variant="ghost" aria-label="Move up" onClick={() => handleReorder(item, -1)}><ArrowUp size={16} /></Button>
                              <Button size="icon" variant="ghost" aria-label="Move down" onClick={() => handleReorder(item, 1)}><ArrowDown size={16} /></Button>
                            </>
                          )}
                          {customActions?.(item)}
                          <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => initForm(item)}><Pencil size={16} /></Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="text-destructive" disabled={deletingId === item.id}>
                                {deletingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction>
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

export default CrudPage;
