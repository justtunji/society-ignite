import { useEffect, useState } from 'react';
import { adminLog, type AdminLogEntry } from '@/lib/adminErrorLog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlertCircle, Trash2, ClipboardCopy } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

/**
 * Floating admin error report panel.
 * Shows a badge with the count of recent failures and opens a side panel
 * listing the last failed admin operations with timestamps + Supabase
 * error code/details/hint. Helps diagnose stalled requests in production.
 */
export const AdminErrorReport = () => {
  const [items, setItems] = useState<AdminLogEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => adminLog.subscribe(setItems), []);

  const failures = items.filter((i) => i.status !== 'info');
  const latest = failures[0];

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(items, null, 2));
      toast({ title: 'Copied', description: 'Error report copied to clipboard.' });
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant={failures.length ? 'destructive' : 'outline'}
          size="sm"
          className="gap-2"
          title={latest ? `Last error: ${latest.message}` : 'No errors'}
        >
          <AlertCircle className="h-4 w-4" />
          Errors
          {failures.length > 0 && (
            <Badge variant="secondary" className="ml-1">{failures.length}</Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Admin error report</SheetTitle>
        </SheetHeader>
        <div className="flex items-center gap-2 mt-4">
          <Button size="sm" variant="outline" onClick={copyAll} disabled={!items.length}>
            <ClipboardCopy className="h-4 w-4 mr-2" />Copy
          </Button>
          <Button size="sm" variant="ghost" onClick={() => adminLog.clear()} disabled={!items.length}>
            <Trash2 className="h-4 w-4 mr-2" />Clear
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No admin operations have failed in this session.
            </p>
          )}
          {items.map((e) => (
            <div key={e.id} className="border rounded-md p-3 text-sm space-y-1">
              <div className="flex items-center justify-between gap-2">
                <Badge variant={e.status === 'timeout' ? 'destructive' : e.status === 'error' ? 'destructive' : 'secondary'}>
                  {e.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(e.timestamp), 'HH:mm:ss')} · {e.durationMs ?? '?'}ms
                </span>
              </div>
              <div className="font-medium">
                {e.label}{e.scope ? <span className="text-muted-foreground"> · {e.scope}</span> : null}
              </div>
              <div className="text-destructive break-words">{e.message}</div>
              {(e.code || e.details || e.hint) && (
                <div className="text-xs text-muted-foreground space-y-0.5 pt-1">
                  {e.code && <div><span className="font-semibold">code:</span> {e.code}</div>}
                  {e.details && <div><span className="font-semibold">details:</span> {e.details}</div>}
                  {e.hint && <div><span className="font-semibold">hint:</span> {e.hint}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
