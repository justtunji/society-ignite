import { useCallback, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AsyncBoundary } from '@/components/admin/AsyncBoundary';
import { useAsyncResource, withTimeout } from '@/hooks/useAsync';
import { useToast } from '@/hooks/use-toast';
import { adminLog } from '@/lib/adminErrorLog';
import { Upload, Trash2, Copy, RefreshCw, Loader2, FileIcon } from 'lucide-react';

const BUCKETS = ['cms-media', 'partner-logos'] as const;
type Bucket = typeof BUCKETS[number];

interface FileItem {
  name: string;
  id?: string;
  updated_at?: string;
  metadata?: { size?: number; mimetype?: string };
}

const TIMEOUT = 20_000;
const MAX_BYTES = 20 * 1024 * 1024;

const MediaAdmin = () => {
  const [bucket, setBucket] = useState<Bucket>('cms-media');
  const [folder, setFolder] = useState('uploads');
  const [uploading, setUploading] = useState(false);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const loader = useCallback(async () => {
    const { data, error } = await supabase.storage.from(bucket).list(folder, {
      limit: 200,
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (error) throw error;
    return (data ?? []) as FileItem[];
  }, [bucket, folder]);

  const { data, status, error, refetch } = useAsyncResource<FileItem[]>(loader, [loader], TIMEOUT);
  const list = (data ?? []).filter(f => f.name && f.name !== '.emptyFolderPlaceholder');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        if (file.size > MAX_BYTES) {
          toast({ title: `${file.name} too large`, description: `Max ${MAX_BYTES / 1024 / 1024}MB`, variant: 'destructive' });
          continue;
        }
        const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
        const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const { error: upErr } = await withTimeout<any>(
          supabase.storage.from(bucket).upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type || undefined }) as any,
          TIMEOUT, 'upload',
        );
        if (upErr) throw upErr;
      }
      toast({ title: 'Uploaded' });
      refetch();
    } catch (err: any) {
      adminLog.push({ label: 'upload', scope: `storage:${bucket}`, status: 'error', message: err?.message });
      toast({ title: 'Upload failed', description: err?.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDelete = async (name: string) => {
    const path = `${folder}/${name}`;
    setDeletingPath(path);
    try {
      const { error: delErr } = await withTimeout<any>(
        supabase.storage.from(bucket).remove([path]) as any, TIMEOUT, 'delete',
      );
      if (delErr) throw delErr;
      toast({ title: 'Deleted' });
      refetch();
    } catch (err: any) {
      adminLog.push({ label: 'delete', scope: `storage:${bucket}`, status: 'error', message: err?.message });
      toast({ title: 'Delete failed', description: err?.message, variant: 'destructive' });
    } finally { setDeletingPath(null); }
  };

  const publicUrl = (name: string) =>
    supabase.storage.from(bucket).getPublicUrl(`${folder}/${name}`).data.publicUrl;

  const copyUrl = async (name: string) => {
    await navigator.clipboard.writeText(publicUrl(name));
    toast({ title: 'URL copied' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={bucket} onValueChange={(v) => setBucket(v as Bucket)}>
            <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {BUCKETS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input className="w-[160px]" value={folder} onChange={e => setFolder(e.target.value)} placeholder="folder" />
          <Button variant="outline" size="sm" onClick={refetch} disabled={status === 'loading'}>
            <RefreshCw className={`h-4 w-4 mr-2 ${status === 'loading' ? 'animate-spin' : ''}`} />Refresh
          </Button>
          <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading…</> : <><Upload className="h-4 w-4 mr-2" />Upload</>}
          </Button>
          <input ref={inputRef} type="file" multiple className="hidden" onChange={handleUpload} />
        </div>
      </div>

      <AsyncBoundary status={status} error={error} onRetry={refetch} loadingLabel="Loading files…">
        {list.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No files in <code>{bucket}/{folder}</code>.</CardContent></Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {list.map(f => {
              const url = publicUrl(f.name);
              const isImage = (f.metadata?.mimetype || '').startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(f.name);
              return (
                <Card key={f.name} className="overflow-hidden group">
                  <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                    {isImage ? (
                      <img src={url} alt={f.name} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <FileIcon className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <CardContent className="p-3 space-y-2">
                    <p className="text-xs truncate" title={f.name}>{f.name}</p>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" onClick={() => copyUrl(f.name)} title="Copy URL"><Copy size={14} /></Button>
                      <Button size="icon" variant="ghost" asChild title="Open"><a href={url} target="_blank" rel="noreferrer"><FileIcon size={14} /></a></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="text-destructive ml-auto" disabled={deletingPath === `${folder}/${f.name}`}>
                            {deletingPath === `${folder}/${f.name}` ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete {f.name}?</AlertDialogTitle>
                            <AlertDialogDescription>This permanently removes the file from storage.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(f.name)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </AsyncBoundary>
    </div>
  );
};

export default MediaAdmin;
