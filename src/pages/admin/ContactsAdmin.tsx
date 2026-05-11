import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { AsyncBoundary } from '@/components/admin/AsyncBoundary';
import { useAsyncResource, withTimeout } from '@/hooks/useAsync';
import { RefreshCw } from 'lucide-react';

const ContactsAdmin = () => {
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loader = useCallback(async () => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }, []);

  const { data: items, status, error, refetch } = useAsyncResource<any[]>(loader, [loader], 15000);

  const toggleHandled = async (id: string, current: boolean) => {
    setUpdatingId(id);
    try {
      const { error: updateError } = await withTimeout<any>(
        supabase.from('contact_submissions').update({ handled: !current }).eq('id', id) as any,
        15000,
        'update',
      );
      if (updateError) throw updateError;
      refetch();
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Unknown error', variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
        <Button variant="outline" size="sm" onClick={refetch} disabled={status === 'loading'}>
          <RefreshCw className={`h-4 w-4 mr-2 ${status === 'loading' ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>
      <AsyncBoundary status={status} error={error} onRetry={refetch} loadingLabel="Loading submissions…">
        {(items ?? []).length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">No submissions yet.</Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(items ?? []).map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="whitespace-nowrap">{item.created_at ? format(new Date(item.created_at), 'MMM d, yyyy') : '—'}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.subject || '—'}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.message}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => toggleHandled(item.id, item.handled)} disabled={updatingId === item.id}>
                          <Badge variant={item.handled ? 'default' : 'secondary'}>{item.handled ? 'Handled' : 'New'}</Badge>
                        </Button>
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

export default ContactsAdmin;
