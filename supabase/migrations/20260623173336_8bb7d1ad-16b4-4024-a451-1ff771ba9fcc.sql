
ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS mailchimp_status text,
  ADD COLUMN IF NOT EXISTS mailchimp_synced_at timestamptz,
  ADD COLUMN IF NOT EXISTS mailchimp_last_error text,
  ADD COLUMN IF NOT EXISTS acceptance_email_status text,
  ADD COLUMN IF NOT EXISTS acceptance_email_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS acceptance_email_error text;
