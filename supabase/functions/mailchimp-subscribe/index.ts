import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";
import { z } from "https://esm.sh/zod@3.23.8";

const BodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  source: z.string().optional().default("website"),
  tags: z.array(z.string()).optional().default([]),
  merge_fields: z.record(z.string()).optional().default({}),
  member_id: z.string().uuid().optional(),
});

const md5Hex = (input: string) => {
  const bytes = new TextEncoder().encode(input);
  const paddedLength = (((bytes.length + 8) >> 6) + 1) << 6;
  const padded = new Uint8Array(paddedLength);
  padded.set(bytes);
  padded[bytes.length] = 0x80;

  const view = new DataView(padded.buffer);
  const bitLength = bytes.length * 8;
  view.setUint32(paddedLength - 8, bitLength >>> 0, true);
  view.setUint32(paddedLength - 4, Math.floor(bitLength / 0x100000000), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const k = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000));
  const add32 = (...values: number[]) => values.reduce((sum, value) => (sum + value) >>> 0, 0);
  const leftRotate = (value: number, shift: number) => ((value << shift) | (value >>> (32 - shift))) >>> 0;

  for (let offset = 0; offset < paddedLength; offset += 64) {
    const m = Array.from({ length: 16 }, (_, i) => view.getUint32(offset + i * 4, true));
    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let i = 0; i < 64; i++) {
      let f: number;
      let g: number;

      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) % 16;
      }

      const nextD = d;
      d = c;
      c = b;
      b = add32(b, leftRotate(add32(a, f, k[i], m[g]), s[i]));
      a = nextD;
    }

    a0 = add32(a0, a);
    b0 = add32(b0, b);
    c0 = add32(c0, c);
    d0 = add32(d0, d);
  }

  return [a0, b0, c0, d0]
    .flatMap((word) => [word & 0xff, (word >>> 8) & 0xff, (word >>> 16) & 0xff, (word >>> 24) & 0xff])
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

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

    const emailHash = md5Hex(email.toLowerCase());

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
