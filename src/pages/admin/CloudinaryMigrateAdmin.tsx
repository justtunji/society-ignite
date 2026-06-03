import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CloudUpload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { resolveCloudinaryFolder } from '@/lib/cloudinary';

interface Target {
  table: string;
  urlColumn: string;
  label: string;
}

const TARGETS: Target[] = [
  { table: 'gallery_items', urlColumn: 'image_url', label: 'Gallery items' },
  { table: 'partners', urlColumn: 'logo_url', label: 'Partner logos' },
  { table: 'team_members', urlColumn: 'image_url', label: 'Team member photos' },
  { table: 'programs', urlColumn: 'hero_image_url', label: 'Program hero images' },
  { table: 'promotions', urlColumn: 'image_url', label: 'Promotion images' },
  { table: 'stories', urlColumn: 'image_url', label: 'Story images' },
  { table: 'resources', urlColumn: 'thumbnail_url', label: 'Resource thumbnails' },
  { table: 'events', urlColumn: 'cover_image_url', label: 'Event covers' },
  { table: 'pages', urlColumn: 'og_image_url', label: 'Page OG images' },
  { table: 'site_settings', urlColumn: 'logo_url', label: 'Site logo' },
  { table: 'site_settings', urlColumn: 'favicon_url', label: 'Site favicon' },
  { table: 'site_settings', urlColumn: 'og_image_url', label: 'Site OG image' },
];

type RunState = { loading: boolean; result?: any; dryRun?: boolean };

const CloudinaryMigrateAdmin = () => {
  const [state, setState] = useState<Record<string, RunState>>({});
  const { toast } = useToast();

  const run = async (t: Target, dryRun: boolean) => {
    const key = `${t.table}.${t.urlColumn}`;
    setState((s) => ({ ...s, [key]: { loading: true, dryRun } }));
    try {
      const { data, error } = await supabase.functions.invoke('cloudinary-migrate', {
        body: { table: t.table, urlColumn: t.urlColumn, folder: resolveCloudinaryFolder(t.table), dryRun },
      });
      if (error) throw error;
      setState((s) => ({ ...s, [key]: { loading: false, result: data, dryRun } }));
      toast({
        title: dryRun ? 'Dry run complete' : 'Migration complete',
        description: `${t.label}: ${data.migrated} migrated, ${data.skipped} skipped, ${data.failed} failed`,
      });
    } catch (err: any) {
      setState((s) => ({ ...s, [key]: { loading: false, result: { error: err?.message } } }));
      toast({ title: 'Migration failed', description: err?.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CloudUpload className="h-7 w-7" /> Cloudinary Migration
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Re-upload existing images stored in Supabase Storage (or other external URLs) to Cloudinary
          and update the database. URLs already pointing to Cloudinary are skipped automatically. Always
          run a dry-run first.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {TARGETS.map((t) => {
          const key = `${t.table}.${t.urlColumn}`;
          const s = state[key];
          const r = s?.result;
          return (
            <Card key={key}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{t.label}</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {t.table}.{t.urlColumn}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled={s?.loading} onClick={() => run(t, true)}>
                    {s?.loading && s?.dryRun ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    Dry run
                  </Button>
                  <Button size="sm" disabled={s?.loading} onClick={() => run(t, false)}>
                    {s?.loading && !s?.dryRun ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    Migrate
                  </Button>
                </div>
                {r && (
                  <div className="text-xs space-y-1 bg-muted/50 rounded p-2">
                    {r.error ? (
                      <p className="text-destructive">{r.error}</p>
                    ) : (
                      <>
                        <p>
                          {s?.dryRun ? 'Would migrate' : 'Migrated'}: <b>{r.migrated}</b> · Skipped:{' '}
                          <b>{r.skipped}</b> · Failed: <b>{r.failed}</b>
                        </p>
                        {r.results?.filter((x: any) => x.action === 'failed').slice(0, 3).map((x: any, i: number) => (
                          <p key={i} className="text-destructive truncate" title={x.error}>
                            ✗ {x.error}
                          </p>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CloudinaryMigrateAdmin;
