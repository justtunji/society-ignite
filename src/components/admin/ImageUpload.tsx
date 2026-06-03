import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  /** @deprecated kept for API compatibility; uploads now go to Cloudinary */
  bucket?: string;
  /** Logical folder key (e.g. 'gallery_items', 'partners'). Mapped server-side. */
  folder?: string;
}

const MAX_BYTES = 10 * 1024 * 1024;

export const ImageUpload = ({ value, onChange, folder = 'uploads' }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const reset = () => {
    setUploading(false);
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
        description: `Max ${MAX_BYTES / 1024 / 1024}MB. Yours is ${(file.size / 1024 / 1024).toFixed(1)}MB.`,
        variant: 'destructive',
      });
      reset();
      return;
    }

    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, folder);
      onChange(result.url);
      toast({ title: 'Image uploaded to Cloudinary' });
    } catch (err: any) {
      console.error('[ImageUpload] failed:', err);
      toast({ title: 'Upload failed', description: err?.message || 'Unknown error', variant: 'destructive' });
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
            <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
          </span>
        ) : value ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => inputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" /> Replace
          </Button>
        ) : null}
      </div>
      <p className="text-xs text-muted-foreground">PNG, JPG, WebP, GIF up to 10MB. Stored on Cloudinary.</p>
    </div>
  );
};
