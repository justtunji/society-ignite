import { useState } from 'react';
import CrudPage, { FieldConfig } from './CrudPage';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { subscribeToMailchimp } from '@/lib/mailchimp';
import { useToast } from '@/hooks/use-toast';

const fields: FieldConfig[] = [
  { name: 'name', label: 'Name', type: 'text', required: true, showInTable: true },
  { name: 'email', label: 'Email', type: 'text', required: true, showInTable: true },
  { name: 'category', label: 'Membership Level', type: 'select', showInTable: true, options: [
    { label: 'Scholar Membership (SM)', value: 'Scholar Membership (SM)' },
    { label: 'Academic and Scholar Membership (ASM)', value: 'Academic and Scholar Membership (ASM)' },
    { label: 'Independent Professional Membership (IPM)', value: 'Independent Professional Membership (IPM)' },
    { label: 'Executive Leadership Membership (ELM)', value: 'Executive Leadership Membership (ELM)' },
  ]},
  { name: 'is_verified', label: 'Accepted', type: 'boolean', showInTable: true },
  { name: 'mailerlite_subscribed', label: 'Mailchimp Synced', type: 'boolean', showInTable: true },
  { name: 'joined_at', label: 'Joined At', type: 'datetime' },
  { name: 'mailerlite_id', label: 'Mailchimp ID', type: 'text' },
];

const ApproveButton = ({ item }: { item: any }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<boolean>(!!item.is_verified);

  const handleApprove = async () => {
    if (loading || done) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('members')
        .update({ is_verified: true })
        .eq('id', item.id);
      if (error) throw error;

      // Re-sync to Mailchimp with STATUS=Accepted — triggers your "Application Accepted" automation
      await subscribeToMailchimp({
        email: item.email,
        name: item.name,
        source: 'admin-approval',
        tags: ['Accepted', item.category].filter(Boolean),
        merge_fields: {
          MEMLEVEL: item.category || '',
          STATUS: 'Accepted',
        },
      });

      toast({ title: 'Application approved', description: `Acceptance email queued in Mailchimp for ${item.email}.` });
      setDone(true);
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Could not approve', description: err.message || 'Try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
        <CheckCircle2 className="h-4 w-4" /> Accepted
      </span>
    );
  }

  return (
    <Button size="sm" variant="outline" onClick={handleApprove} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve & Notify'}
    </Button>
  );
};

const MembersAdmin = () => (
  <CrudPage
    module="members"
    title="Members"
    tableName="members"
    fields={fields}
    orderBy="joined_at"
    orderAsc={false}
    slugField={false}
    customActions={(item) => <ApproveButton item={item} />}
  />
);

export default MembersAdmin;
