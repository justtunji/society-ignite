/**
 * Cloudinary client helpers.
 *
 * - `uploadToCloudinary` asks the `cloudinary-sign` edge function for a
 *   short-lived signature, then uploads the file directly from the browser.
 * - `cldUrl` rewrites an existing Cloudinary URL with optimization
 *   transformations (f_auto, q_auto, width, etc.) for fast responsive delivery.
 *   Non-Cloudinary URLs are returned unchanged.
 */
import { supabase } from '@/integrations/supabase/client';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

const FOLDER_MAP: Record<string, string> = {
  uploads: 'sba/uploads',
  logos: 'sba/logos',
  favicons: 'sba/favicons',
  og: 'sba/og',
  gallery_items: 'sba/gallery',
  partners: 'sba/partners',
  team_members: 'sba/team',
  programs: 'sba/programs',
  promotions: 'sba/promotions',
  stories: 'sba/stories',
  resources: 'sba/resources',
  events: 'sba/events',
  pages: 'sba/pages',
  site_settings: 'sba/site',
  communities: 'sba/communities',
};

export function resolveCloudinaryFolder(folder?: string): string {
  if (!folder) return 'sba/uploads';
  return FOLDER_MAP[folder] || `sba/${folder.replace(/[^a-z0-9_-]/gi, '_')}`;
}

export async function uploadToCloudinary(
  file: File,
  folder?: string,
): Promise<CloudinaryUploadResult> {
  const targetFolder = resolveCloudinaryFolder(folder);

  const { data: signed, error: signErr } = await supabase.functions.invoke('cloudinary-sign', {
    body: { folder: targetFolder },
  });
  if (signErr) throw new Error(signErr.message || 'Failed to get upload signature');
  if (!signed?.signature) throw new Error(signed?.error || 'Invalid signature response');

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', signed.api_key);
  form.append('timestamp', String(signed.timestamp));
  form.append('folder', signed.folder);
  form.append('signature', signed.signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${signed.cloud_name}/auto/upload`,
    { method: 'POST', body: form },
  );
  const json = await res.json();
  if (!res.ok || !json.secure_url) {
    throw new Error(json?.error?.message || `Cloudinary upload failed (${res.status})`);
  }
  return {
    url: json.secure_url,
    publicId: json.public_id,
    width: json.width,
    height: json.height,
    format: json.format,
    bytes: json.bytes,
  };
}

export interface CldOptions {
  w?: number;       // width
  h?: number;       // height
  q?: 'auto' | number;
  f?: 'auto' | string;
  c?: 'fill' | 'fit' | 'limit' | 'thumb' | 'scale';
  dpr?: 'auto' | number;
}

/**
 * Inject Cloudinary transformations into a delivery URL.
 * Returns the input untouched if it's not a Cloudinary URL.
 */
export function cldUrl(url: string | null | undefined, opts: CldOptions = {}): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;

  const parts: string[] = [];
  parts.push(`f_${opts.f ?? 'auto'}`);
  parts.push(`q_${opts.q ?? 'auto'}`);
  if (opts.w) parts.push(`w_${opts.w}`);
  if (opts.h) parts.push(`h_${opts.h}`);
  if (opts.c) parts.push(`c_${opts.c}`);
  parts.push(`dpr_${opts.dpr ?? 'auto'}`);
  const transform = parts.join(',');

  // Strip any existing transformation segment between /upload/ and the version (vNNN) or path.
  return url.replace(/\/upload\/(?:[^/]+\/)?(v\d+\/|)/, `/upload/${transform}/$1`);
}
