// Cloudinary signed-upload helper. Returns a signature so the browser can
// upload directly to Cloudinary without exposing the API secret.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function sha1Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const configuredCloudName = Deno.env.get("CLOUDINARY_CLOUD_NAME")?.trim();
    const cloudName = !configuredCloudName || configuredCloudName.toLowerCase() === "sba"
      ? "deaxltomx"
      : configuredCloudName;
    const apiKey = Deno.env.get("CLOUDINARY_API_KEY");
    const apiSecret = Deno.env.get("CLOUDINARY_API_SECRET");
    if (!apiKey || !apiSecret) {
      return new Response(JSON.stringify({ error: "Cloudinary env vars not set" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify staff user (admin or editor)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: roles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .in("role", ["admin", "editor"]);
    if (!roles || roles.length === 0) {
      return new Response(JSON.stringify({ error: "Admin or editor only" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const folder = typeof body.folder === "string" && body.folder ? body.folder : "sba/uploads";
    const timestamp = Math.floor(Date.now() / 1000);

    // Sign: alphabetical key=value joined by &, then append api_secret.
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = await sha1Hex(paramsToSign + apiSecret);

    return new Response(
      JSON.stringify({ signature, timestamp, api_key: apiKey, cloud_name: cloudName, folder }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
