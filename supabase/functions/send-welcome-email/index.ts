import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";
import { z } from "https://esm.sh/zod@3.23.8";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

const BodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(200),
  category: z.string().max(200).optional().default("Member"),
  track: z.string().max(200).optional().default(""),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

    const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL");
    if (!RESEND_FROM_EMAIL) throw new Error("RESEND_FROM_EMAIL is not configured");

    // Normalize sender into "Name <email@domain>" or "email@domain"
    const emailRegex = /[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+/;
    let fromHeader = RESEND_FROM_EMAIL.trim();
    if (!emailRegex.test(fromHeader)) {
      throw new Error(`RESEND_FROM_EMAIL must contain a valid email address, got: ${fromHeader}`);
    }
    // If it's a bare email, wrap with friendly name
    if (!fromHeader.includes("<")) {
      fromHeader = `Society of Black Academics <${fromHeader}>`;
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, name, category, track } = parsed.data;
    const firstName = name.split(/\s+/)[0] || "there";

    const subject = "Welcome to the Society of Black Academics";
    const html = `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <div style="background: #000; color: #fff; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">Society of Black Academics</h1>
        </div>
        <div style="padding: 28px 24px;">
          <h2 style="color: #B8860B; margin-top: 0;">Welcome, ${firstName}!</h2>
          <p>Thank you for joining SBA. Your application for <strong>${category}</strong> has been <strong>accepted</strong>.</p>
          ${track ? `<p>Your research track: <strong>${track}</strong></p>` : ""}
          <p>You'll start receiving member-only updates, invitations and resources shortly.</p>
          <p style="margin-top: 28px;">
            <a href="https://societyofblackacademics.com" style="background: #B8860B; color: #fff; padding: 12px 22px; text-decoration: none; border-radius: 6px; display: inline-block;">Visit SBA</a>
          </p>
          <p style="color: #555; margin-top: 32px; font-size: 13px;">If you have any questions, simply reply to this email.</p>
        </div>
        <div style="text-align: center; color: #888; font-size: 12px; padding: 16px;">
          © Society of Black Academics
        </div>
      </div>
    `;

    const resendResp = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: fromHeader,
        to: [email],
        subject,
        html,
      }),
    });

    const resendData = await resendResp.json();
    if (!resendResp.ok) {
      const errMsg = `Resend error [${resendResp.status}]: ${resendData.message || resendData.error || JSON.stringify(resendData)}`;
      console.error(errMsg);
      return new Response(JSON.stringify({ error: errMsg }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: resendData.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("send-welcome-email error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
