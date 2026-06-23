import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";
import { z } from "https://esm.sh/zod@3.23.8";
import { md5 } from "npm:@noble/hashes@1.4.0/md5";
import { bytesToHex } from "npm:@noble/hashes@1.4.0/utils";

const BodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  source: z.string().optional().default("website"),
  tags: z.array(z.string()).optional().default([]),
  merge_fields: z.record(z.string()).optional().default({}),
  member_id: z.string().uuid().optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  let memberId: string | undefined;

  const recordSync = async (status: string, errorMsg: string | null, mailchimpId?: string | null) => {
    if (!memberId) return;
    try {
      const update: Record<string, unknown> = {
        mailchimp_status: status,
        mailchimp_synced_at: new Date().toISOString(),
        mailchimp_last_error: errorMsg,
        mailerlite_subscribed: status === "success",
      };
      if (mailchimpId) update.mailerlite_id = mailchimpId;
      await supabase.from("members").update(update).eq("id", memberId);
    } catch (e) {
      console.error("Failed to record sync status:", e);
    }
  };

  try {
    const MAILCHIMP_API_KEY = Deno.env.get("MAILCHIMP_API_KEY");
    if (!MAILCHIMP_API_KEY) throw new Error("MAILCHIMP_API_KEY is not configured");

    const MAILCHIMP_AUDIENCE_ID = Deno.env.get("MAILCHIMP_AUDIENCE_ID");
    if (!MAILCHIMP_AUDIENCE_ID) throw new Error("MAILCHIMP_AUDIENCE_ID is not configured");

    const dc = MAILCHIMP_API_KEY.split("-").pop();
    if (!dc) throw new Error("Invalid Mailchimp API key format");

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, name, source, tags, merge_fields, member_id } = parsed.data;
    memberId = member_id;

    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const mailchimpUrl = `https://${dc}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;
    const authHeader = btoa(`anystring:${MAILCHIMP_API_KEY}`);

    const emailHash = bytesToHex(md5(new TextEncoder().encode(email.toLowerCase())));

    const mcResponse = await fetch(`${mailchimpUrl}/${emailHash}`, {
      method: "PUT",
      headers: { Authorization: `Basic ${authHeader}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email_address: email,
        status_if_new: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
          SOURCE: source,
          ...merge_fields,
        },
      }),
    });

    const mcData = await mcResponse.json();

    if (!mcResponse.ok) {
      console.error("Mailchimp API error:", mcData);
      const errMsg = `Mailchimp error [${mcResponse.status}]: ${mcData.detail || mcData.title}`;
      await recordSync("error", errMsg);
      throw new Error(errMsg);
    }

    if (tags.length > 0) {
      await fetch(`${mailchimpUrl}/${emailHash}/tags`, {
        method: "POST",
        headers: { Authorization: `Basic ${authHeader}`, "Content-Type": "application/json" },
        body: JSON.stringify({ tags: tags.map(tag => ({ name: tag, status: "active" })) }),
      });
    }

    await supabase.from("contact_submissions").insert({
      name,
      email,
      message: `Mailchimp subscription from ${source}`,
      subject: tags.length > 0 ? `Tags: ${tags.join(", ")}` : `Source: ${source}`,
      source_page: source,
    });

    await recordSync("success", null, mcData.id ?? emailHash);

    return new Response(
      JSON.stringify({ success: true, status: mcData.status, mailchimp_id: mcData.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    if (memberId) await recordSync("error", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
