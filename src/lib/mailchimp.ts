import { supabase } from "@/integrations/supabase/client";

interface MailchimpSubscribeParams {
  email: string;
  name: string;
  source: string;
  tags?: string[];
  merge_fields?: Record<string, string>;
  member_id?: string;
}


export async function subscribeToMailchimp(params: MailchimpSubscribeParams) {
  const { data, error } = await supabase.functions.invoke("mailchimp-subscribe", {
    body: params,
  });

  if (error) {
    throw new Error(error.message || "Failed to subscribe");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
}
