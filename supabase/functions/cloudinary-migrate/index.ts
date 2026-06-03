// Admin-only migration: re-uploads existing image URLs (e.g. Supabase Storage)
// to Cloudinary and updates the source row's URL column. Supports dry-run.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function sha1Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface MigrateBody {
  table: string;
  idColumn?: string;
  urlColumn: string;
  folder: string;
  dryRun?: boolean;
  limit?: number;
}

// Allowlist of (table, urlColumn) pairs we will touch — safety guard.
const ALLOWED: Record<string, string[]> = {
  gallery_items: ["image_url"],
  partners: ["logo_url"],
  team_members: ["image_url"],
  programs: ["hero_image_url"],
  promotions: ["image_url"],
  stories: ["image_url"],
  resources: ["thumbnail_url", "file_url"],
  events: ["cover_image_url"],
  pages: ["og_image_url"],
  site_settings: ["logo_url", "favicon_url", "og_image_url"],
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const cloudName = Deno.env.get("CLOUDINARY_CLOUD_NAME");
    const apiKey = Deno.env.get("CLOUDINARY_API_KEY");
    const apiSecret = Deno.env.get("CLOUDINARY_API_SECRET");
    if (!cloudName || !apiKey || !apiSecret) {
      return new Response(JSON.stringify({ error: "Cloudinary env vars not set" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: roles } = await admin
      .from("user_roles").select("role").eq("user_id", userData.user.id).eq("role", "admin");
    if (!roles || roles.length === 0) {
      return new Response(JSON.stringify({ error: "Admin only" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json().catch(() => ({}))) as MigrateBody;
    const { table, urlColumn, folder } = body;
    const idColumn = body.idColumn || "id";
    const dryRun = !!body.dryRun;
    const limit = Math.min(body.limit ?? 200, 500);

    if (!table || !urlColumn || !folder) {
      return new Response(JSON.stringify({ error: "Missing table/urlColumn/folder" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!ALLOWED[table]?.includes(urlColumn)) {
      return new Response(JSON.stringify({ error: `Table/column not allowed: ${table}.${urlColumn}` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: rows, error: selErr } = await admin
      .from(table)
      .select(`${idColumn}, ${urlColumn}`)
      .not(urlColumn, "is", null)
      .limit(limit);
    if (selErr) throw selErr;

    const results: any[] = [];
    let migrated = 0, skipped = 0, failed = 0;

    for (const row of (rows as any[]) || []) {
      const url: string = row[urlColumn];
      const id = row[idColumn];
      if (!url || typeof url !== "string") { skipped++; continue; }
      if (url.includes("res.cloudinary.com")) { skipped++; continue; }

      if (dryRun) {
        results.push({ id, url, action: "would-migrate" });
        migrated++;
        continue;
      }

      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
        const signature = await sha1Hex(paramsToSign + apiSecret);
        const form = new FormData();
        form.append("file", url); // Cloudinary fetches remote URL server-side
        form.append("api_key", apiKey);
        form.append("timestamp", String(timestamp));
        form.append("folder", folder);
        form.append("signature", signature);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          { method: "POST", body: form },
        );
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || !uploadJson.secure_url) {
          throw new Error(uploadJson?.error?.message || `Upload failed (${uploadRes.status})`);
        }
        const newUrl = uploadJson.secure_url as string;
        const { error: updErr } = await admin.from(table).update({ [urlColumn]: newUrl }).eq(idColumn, id);
        if (updErr) throw updErr;
        results.push({ id, oldUrl: url, newUrl, action: "migrated" });
        migrated++;
      } catch (e: any) {
        results.push({ id, url, action: "failed", error: e?.message || String(e) });
        failed++;
      }
    }

    return new Response(
      JSON.stringify({ table, urlColumn, folder, dryRun, scanned: rows?.length ?? 0, migrated, skipped, failed, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
