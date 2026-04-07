import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";
import { z } from "https://esm.sh/zod@3.23.8";

const BodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  source: z.string().optional().default("website"),
  tags: z.array(z.string()).optional().default([]),
  merge_fields: z.record(z.string()).optional().default({}),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const MAILCHIMP_API_KEY = Deno.env.get("MAILCHIMP_API_KEY");
    if (!MAILCHIMP_API_KEY) {
      throw new Error("MAILCHIMP_API_KEY is not configured");
    }

    const MAILCHIMP_AUDIENCE_ID = Deno.env.get("MAILCHIMP_AUDIENCE_ID");
    if (!MAILCHIMP_AUDIENCE_ID) {
      throw new Error("MAILCHIMP_AUDIENCE_ID is not configured");
    }

    // Extract data center from API key (e.g., "us21" from "xxx-us21")
    const dc = MAILCHIMP_API_KEY.split("-").pop();
    if (!dc) {
      throw new Error("Invalid Mailchimp API key format");
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, name, source, tags, merge_fields } = parsed.data;

    // Split name into first/last
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Subscribe/update member in Mailchimp
    const mailchimpUrl = `https://${dc}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;
    
    const mailchimpBody = {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
        SOURCE: source,
        ...merge_fields,
      },
      tags: tags.length > 0 ? tags : undefined,
    };

    const authHeader = btoa(`anystring:${MAILCHIMP_API_KEY}`);

    // Use PUT with subscriber hash for upsert behavior
    const emailHash = await crypto.subtle.digest(
      "MD5",
      new TextEncoder().encode(email.toLowerCase())
    ).then(buf =>
      Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("")
    );

    const mcResponse = await fetch(`${mailchimpUrl}/${emailHash}`, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
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
      throw new Error(`Mailchimp error [${mcResponse.status}]: ${mcData.detail || mcData.title}`);
    }

    // Add tags separately if provided
    if (tags.length > 0) {
      await fetch(`${mailchimpUrl}/${emailHash}/tags`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tags: tags.map(tag => ({ name: tag, status: "active" })),
        }),
      });
    }

    // Also save to contact_submissions for CRM tracking
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from("contact_submissions").insert({
      name,
      email,
      message: `Mailchimp subscription from ${source}`,
      subject: tags.length > 0 ? `Tags: ${tags.join(", ")}` : `Source: ${source}`,
      source_page: source,
    });

    return new Response(
      JSON.stringify({ success: true, status: mcData.status }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
