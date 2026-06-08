import CrudPage, { FieldConfig } from './CrudPage';

const fields: FieldConfig[] = [
  { name: 'name', label: 'Name', type: 'text', required: true, showInTable: true },
  { name: 'email', label: 'Email', type: 'text', required: true, showInTable: true },
  { name: 'category', label: 'Membership Level', type: 'select', showInTable: true, options: [
    { label: 'Scholar Membership (SM)', value: 'Scholar Membership (SM)' },
    { label: 'Academic and Scholar Membership (ASM)', value: 'Academic and Scholar Membership (ASM)' },
    { label: 'Independent Professional Membership (IPM)', value: 'Independent Professional Membership (IPM)' },
    { label: 'Executive Leadership Membership (ELM)', value: 'Executive Leadership Membership (ELM)' },
  ]},
  { name: 'is_verified', label: 'Verified', type: 'boolean', showInTable: true },
  { name: 'mailerlite_subscribed', label: 'Mailchimp Synced', type: 'boolean', showInTable: true },
  { name: 'joined_at', label: 'Joined At', type: 'datetime' },
  { name: 'mailerlite_id', label: 'Mailchimp ID', type: 'text' },
];

const MembersAdmin = () => (
  <CrudPage module="members"
    module="members"
    title="Members"
    tableName="members"
    fields={fields}
    orderBy="joined_at"
    orderAsc={false}
    slugField={false}
  />
);

export default MembersAdmin;
