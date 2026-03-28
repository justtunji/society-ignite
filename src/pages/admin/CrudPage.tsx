import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

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
}

const CrudPage = ({ title, tableName, fields, orderBy = 'created_at', orderAsc = false, slugField = true, customActions }: CrudPageProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();

  const tableColumns = fields.filter(f => f.showInTable !== false).slice(0, 5);

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from(tableName as any)
      .select('*')
      .order(orderBy, { ascending: orderAsc });
    if (data) setItems(data);
    if (error) console.error(error);
    setLoading(false);
  }, [tableName, orderBy, orderAsc]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const initForm = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      const defaults: any = {};
      fields.forEach(f => {
        const defaultValue = f.defaultValue ?? (f.type === 'boolean' ? false : '');
        defaults[f.name] = defaultValue;
      });
      setFormData(defaults);
    }
    setDialogOpen(true);
  };

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSave = async () => {
    const payload = { ...formData };
    if (slugField && payload.title && !payload.slug) {
      payload.slug = generateSlug(payload.title);
    }
    if (!editingItem) delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;

    let error;
    if (editingItem) {
      ({ error } = await supabase.from(tableName as any).update(payload).eq('id', editingItem.id));
    } else {
      ({ error } = await supabase.from(tableName as any).insert(payload as any));
    }

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: editingItem ? 'Updated!' : 'Created!' });
      setDialogOpen(false);
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from(tableName as any).delete().eq('id', id);
    if (error) {
      toast({ title: 'Error deleting', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted!' });
      fetchItems();
    }
  };

  const updateFormField = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const renderField = (field: FieldConfig) => {
    const value = formData[field.name];
    switch (field.type) {
      case 'textarea':
        return <Textarea value={value || ''} onChange={e => updateFormField(field.name, e.target.value)} />;
      case 'richtext':
        return <RichTextEditor value={value || ''} onChange={v => updateFormField(field.name, v)} />;
      case 'number':
        return <Input type="number" value={value || ''} onChange={e => updateFormField(field.name, e.target.value === '' ? '' : parseFloat(e.target.value))} />;
      case 'boolean':
        return <Switch checked={!!value} onCheckedChange={v => updateFormField(field.name, v)} />;
      case 'image':
        return <ImageUpload value={value || ''} onChange={v => updateFormField(field.name, v)} folder={tableName} />;
      case 'date':
        return <Input type="date" value={value || ''} onChange={e => updateFormField(field.name, e.target.value)} />;
      case 'datetime':
        return <Input type="datetime-local" value={value ? value.slice(0, 16) : ''} onChange={e => updateFormField(field.name, e.target.value)} />;
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
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
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
    if (field.type === 'image') return val ? <img src={val} alt="" className="h-10 w-10 object-cover rounded" /> : '—';
    if (val === null || val === undefined || val === '') return '—';
    if (Array.isArray(val)) return val.join(', ');
    const str = String(val);
    return str.length > 60 ? str.slice(0, 60) + '...' : str;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                  <Label>{field.label}</Label>
                  {renderField(field)}
                </div>
              ))}
              <Button onClick={handleSave} className="w-full">{editingItem ? 'Update' : 'Create'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
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
                {items.map(item => (
                  <TableRow key={item.id}>
                    {tableColumns.map(f => (
                      <TableCell key={f.name}>{renderCellValue(item, f)}</TableCell>
                    ))}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {customActions?.(item)}
                        <Button size="icon" variant="ghost" onClick={() => initForm(item)}><Pencil size={16} /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="text-destructive"><Trash2 size={16} /></Button>
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
    </div>
  );
};

export default CrudPage;