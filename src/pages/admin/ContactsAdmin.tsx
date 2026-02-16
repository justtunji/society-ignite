import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const ContactsAdmin = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const toggleHandled = async (id: string, current: boolean) => {
    const { error } = await supabase.from('contact_submissions').update({ handled: !current }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      fetchItems();
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Contact Submissions</h1>
      {items.length === 0 ? (
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
                {items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap">{item.created_at ? format(new Date(item.created_at), 'MMM d, yyyy') : '—'}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.subject || '—'}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.message}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => toggleHandled(item.id, item.handled)}>
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
    </div>
  );
};

export default ContactsAdmin;
