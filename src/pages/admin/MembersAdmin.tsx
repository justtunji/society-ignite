import { useState } from 'react';
import CrudPage, { FieldConfig } from './CrudPage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Loader2, AlertCircle, RefreshCw, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { subscribeToMailchimp } from '@/lib/mailchimp';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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
  { name: 'joined_at', label: 'Joined At', type: 'datetime' },
  { name: 'mailerlite_id', label: 'Mailchimp ID', type: 'text' },
  { name: 'mailchimp_status', label: 'Mailchimp Sync Status', type: 'text' },
  { name: 'mailchimp_synced_at', label: 'Mailchimp Last Sync', type: 'datetime' },
  { name: 'mailchimp_last_error', label: 'Mailchimp Last Error', type: 'textarea' },
  { name: 'acceptance_email_status', label: 'Acceptance Email Status', type: 'text' },
  { name: 'acceptance_email_sent_at', label: 'Acceptance Email Sent At', type: 'datetime' },
  { name: 'acceptance_email_error', label: 'Acceptance Email Error', type: 'textarea' },
];

const fmt = (v?: string | null) => {
  if (!v) return '';
  try { return format(new Date(v), 'd MMM yyyy, HH:mm'); } catch { return v; }
};

const SyncStatusCell = ({ item, onRefresh }: { item: any; onRefresh: () => void }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const status = item.mailchimp_status as string | null;
  const syncedAt = item.mailchimp_synced_at as string | null;
  const error = item.mailchimp_last_error as string | null;

  const resync = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const prefs = (item.preferences ?? {}) as any;
      await subscribeToMailchimp({
        email: item.email,
        name: item.name,
        source: 'admin-resync',
        tags: [item.is_verified ? 'Accepted' : 'Pending', item.category].filter(Boolean),
        merge_fields: {
          MEMLEVEL: item.category || '',
          JOBTITLE: prefs.jobTitle || '',
          INSTITUT: prefs.institution || '',
          TRACK: prefs.researchTrack || '',
          STATUS: item.is_verified ? 'Accepted' : 'Pending',
        },
        member_id: item.id,
      });
      toast({ title: 'Re-synced to Mailchimp' });
      onRefresh();
    } catch (err: any) {
      toast({ title: 'Re-sync failed', description: err.message, variant: 'destructive' });
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  let badge: React.ReactNode;
  if (status === 'success') {
    badge = <Badge className="bg-green-100 text-green-700 border-green-300"><CheckCircle2 className="h-3 w-3 mr-1" />Synced</Badge>;
  } else if (status === 'error') {
    badge = <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>;
  } else if (item.mailerlite_subscribed) {
    badge = <Badge className="bg-green-100 text-green-700 border-green-300"><CheckCircle2 className="h-3 w-3 mr-1" />Synced</Badge>;
  } else {
    badge = <Badge variant="secondary">Not synced</Badge>;
  }

  return (
    <div className="flex flex-col gap-1 min-w-[180px]">
      <div className="flex items-center gap-2">
        {badge}
        <Button size="sm" variant="ghost" onClick={resync} disabled={loading} title="Re-sync to Mailchimp">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
        </Button>
      </div>
      {syncedAt && <span className="text-[11px] text-muted-foreground">Last: {fmt(syncedAt)}</span>}
      {status === 'error' && error && (
        <span className="text-[11px] text-destructive line-clamp-2" title={error}>{error}</span>
      )}
    </div>
  );
};

const ApproveButton = ({ item, onRefresh }: { item: any; onRefresh: () => void }) => {
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

      // Update Mailchimp tag/status (audience)
      await subscribeToMailchimp({
        email: item.email,
        name: item.name,
        source: 'admin-approval',
        tags: ['Accepted', item.category].filter(Boolean),
        merge_fields: {
          MEMLEVEL: item.category || '',
          STATUS: 'Accepted',
        },
        member_id: item.id,
      }).catch((e) => console.warn('Mailchimp status update failed:', e));

      // Send acceptance email via Resend
      const { data: emailRes, error: emailErr } = await supabase.functions.invoke('send-acceptance-email', {
        body: { member_id: item.id },
      });
      if (emailErr) throw new Error(emailErr.message || 'Failed to send acceptance email');
      if (emailRes?.error) throw new Error(emailRes.error);

      toast({ title: 'Application approved', description: `Acceptance email sent to ${item.email}.` });
      setDone(true);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Could not approve', description: err.message || 'Try again.', variant: 'destructive' });
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const resendEmail = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data: emailRes, error: emailErr } = await supabase.functions.invoke('send-acceptance-email', {
        body: { member_id: item.id },
      });
      if (emailErr) throw new Error(emailErr.message || 'Failed');
      if (emailRes?.error) throw new Error(emailRes.error);
      toast({ title: 'Acceptance email re-sent' });
      onRefresh();
    } catch (err: any) {
      toast({ title: 'Resend failed', description: err.message, variant: 'destructive' });
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const emailStatus = item.acceptance_email_status;
  const emailSentAt = item.acceptance_email_sent_at;
  const emailError = item.acceptance_email_error;

  return (
    <div className="flex flex-col gap-1 min-w-[200px]">
      {done ? (
        <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
          <CheckCircle2 className="h-4 w-4" /> Accepted
        </span>
      ) : (
        <Button size="sm" variant="outline" onClick={handleApprove} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve & Notify'}
        </Button>
      )}
      {done && (
        <>
          <div className="flex items-center gap-2">
            {emailStatus === 'sent' ? (
              <Badge className="bg-green-100 text-green-700 border-green-300"><Mail className="h-3 w-3 mr-1" />Email sent</Badge>
            ) : emailStatus === 'error' ? (
              <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Email failed</Badge>
            ) : (
              <Badge variant="secondary">No email yet</Badge>
            )}
            <Button size="sm" variant="ghost" onClick={resendEmail} disabled={loading} title="Re-send acceptance email">
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            </Button>
          </div>
          {emailSentAt && <span className="text-[11px] text-muted-foreground">{fmt(emailSentAt)}</span>}
          {emailStatus === 'error' && emailError && (
            <span className="text-[11px] text-destructive line-clamp-2" title={emailError}>{emailError}</span>
          )}
        </>
      )}
    </div>
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
    customActions={(item, refresh) => (
      <div className="flex items-center gap-3">
        <SyncStatusCell item={item} onRefresh={refresh ?? (() => {})} />
        <ApproveButton item={item} onRefresh={refresh ?? (() => {})} />
      </div>
    )}
  />
);

export default MembersAdmin;
