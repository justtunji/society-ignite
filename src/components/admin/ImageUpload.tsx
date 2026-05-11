import { useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { withTimeout } from '@/hooks/useAsync';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
}

const MAX_BYTES = 10 * 1024 * 1024; // 10MB
const UPLOAD_TIMEOUT = 30_000; // 30s hard cap so the UI never hangs

export const ImageUpload = ({ value, onChange, bucket = 'cms-media', folder = 'uploads' }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progressLabel, setProgressLabel] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const reset = () => {
    setUploading(false);
    setProgressLabel('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please select an image file.', variant: 'destructive' });
      reset();
      return;
    }

    if (file.size > MAX_BYTES) {
      toast({
        title: 'File too large',
        description: `Max size is ${MAX_BYTES / 1024 / 1024}MB. Yours is ${(file.size / 1024 / 1024).toFixed(1)}MB.`,
        variant: 'destructive',
      });
      reset();
      return;
    }

    setUploading(true);
    setProgressLabel('Checking session…');

    try {
      const { data: sessionData, error: sessionError } = await withTimeout(
        supabase.auth.getSession(),
        5000,
        'auth check',
      );
      if (sessionError) throw sessionError;
      if (!sessionData.session) {
        throw new Error('Your session expired. Please sign in to /admin again.');
      }

      setProgressLabel('Uploading…');
      const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

      const { error: uploadError } = await withTimeout(
        supabase.storage.from(bucket).upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || undefined,
        }),
        UPLOAD_TIMEOUT,
        'upload',
      );
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(publicUrl);
      toast({ title: 'Image uploaded' });
    } catch (error: any) {
      console.error('[ImageUpload] failed:', error);
      const msg = error?.message || 'Unknown error';
      toast({
        title: 'Upload failed',
        description: msg.includes('row-level security')
          ? 'Permission denied. Make sure you are signed in as an admin.'
          : msg,
        variant: 'destructive',
      });
    } finally {
      reset();
    }
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border bg-muted">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            disabled={uploading}
            aria-label="Remove image"
            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 disabled:opacity-50"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="max-w-xs"
        />
        {uploading ? (
          <span className="text-sm text-muted-foreground inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> {progressLabel || 'Uploading…'}
          </span>
        ) : value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" /> Replace
          </Button>
        ) : null}
      </div>
      <p className="text-xs text-muted-foreground">PNG, JPG, WebP, GIF up to 10MB.</p>
    </div>
  );
};
