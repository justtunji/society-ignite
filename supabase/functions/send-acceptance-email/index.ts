import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";
import { z } from "https://esm.sh/zod@3.23.8";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

const BodySchema = z.object({
  member_id: z.string().uuid(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabaseService = createClient(supabaseUrl, serviceKey);

  // Auth check: only admins
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claims?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claims.claims.sub as string;
    const { data: isAdmin } = await supabaseService.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    console.error("Auth check failed:", e);
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let memberId: string | undefined;
  const recordStatus = async (status: string, errorMsg: string | null) => {
    if (!memberId) return;
    try {
      await supabaseService.from("members").update({
        acceptance_email_status: status,
        acceptance_email_sent_at: new Date().toISOString(),
        acceptance_email_error: errorMsg,
      }).eq("id", memberId);
    } catch (e) {
      console.error("Failed to record acceptance email status:", e);
    }
  };

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

    const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL");
    if (!RESEND_FROM_EMAIL) throw new Error("RESEND_FROM_EMAIL is not configured");

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    memberId = parsed.data.member_id;

    const { data: member, error: memberErr } = await supabaseService
      .from("members")
      .select("id, name, email, category, preferences")
      .eq("id", memberId)
      .maybeSingle();

    if (memberErr || !member) {
      throw new Error("Member not found");
    }

    const firstName = (member.name || "").split(/\s+/)[0] || "there";
    const level = member.category || "Member";
    const prefs = (member.preferences ?? {}) as Record<string, unknown>;
    const track = (prefs.research_track as string) || "";
    const siteUrl = (prefs.site_url as string) || "https://societyofblackacademics.com";

    const subject = "Your SBA application has been accepted";
    const html = `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <div style="background: #000; color: #fff; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">Society of Black Academics</h1>
        </div>
        <div style="padding: 28px 24px;">
          <h2 style="color: #B8860B; margin-top: 0;">Welcome, ${firstName}!</h2>
          <p>We're delighted to let you know that your application for <strong>${level}</strong> has been <strong>accepted</strong>.</p>
          ${track ? `<p>Your research track: <strong>${track}</strong></p>` : ""}
          <p>You'll start receiving member-only updates, invitations and resources shortly.</p>
          <p style="margin-top: 28px;">
            <a href="${siteUrl}" style="background: #B8860B; color: #fff; padding: 12px 22px; text-decoration: none; border-radius: 6px; display: inline-block;">Visit SBA</a>
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
        from: RESEND_FROM_EMAIL,
        to: [member.email],
        subject,
        html,
      }),
    });

    const resendData = await resendResp.json();

    if (!resendResp.ok) {
      const errMsg = `Resend error [${resendResp.status}]: ${resendData.message || resendData.error || JSON.stringify(resendData)}`;
      await recordStatus("error", errMsg);
      throw new Error(errMsg);
    }

    await recordStatus("sent", null);

    return new Response(
      JSON.stringify({ success: true, id: resendData.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("send-acceptance-email error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    if (memberId) await recordStatus("error", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
