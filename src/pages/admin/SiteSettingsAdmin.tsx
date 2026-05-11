import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { AsyncBoundary } from '@/components/admin/AsyncBoundary';
import { useToast } from '@/hooks/use-toast';
import { useAsyncResource, withTimeout } from '@/hooks/useAsync';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const SiteSettingsAdmin = () => {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loader = useCallback(async () => {
    const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
    if (error) throw error;
    return data;
  }, []);

  const { data: settings, status, error, refetch, setData } = useAsyncResource<any>(loader, [loader], 15000);

  const updateField = (field: string, value: any) => {
    setData({ ...(settings || {}), [field]: value });
  };

  const handleSave = async () => {
    if (!settings || saving) return;
    setSaving(true);
    try {
      const { error: saveErr } = await withTimeout<any>(
        supabase.from('site_settings').update(settings).eq('id', settings.id) as any,
        15000,
        'save',
      );
      if (saveErr) throw saveErr;
      toast({ title: 'Settings saved' });
    } catch (err: any) {
      toast({ title: 'Error saving', description: err?.message || 'Unknown error', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="social">Social & Contact</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader><CardTitle>General</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Site Name</Label><Input value={settings.site_name || ''} onChange={e => updateField('site_name', e.target.value)} /></div>
              <div><Label>Tagline</Label><Input value={settings.tagline || ''} onChange={e => updateField('tagline', e.target.value)} /></div>
              <div><Label>Logo</Label><ImageUpload value={settings.logo_url || ''} onChange={v => updateField('logo_url', v)} folder="logos" /></div>
              <div><Label>Favicon</Label><ImageUpload value={settings.favicon_url || ''} onChange={v => updateField('favicon_url', v)} folder="favicons" /></div>
              <div><Label>Footer Blurb</Label><Textarea value={settings.footer_blurb || ''} onChange={e => updateField('footer_blurb', e.target.value)} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero">
          <Card>
            <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Headline</Label><Textarea value={settings.hero_headline || ''} onChange={e => updateField('hero_headline', e.target.value)} /></div>
              <div><Label>Subheadline</Label><Textarea value={settings.hero_subheadline || ''} onChange={e => updateField('hero_subheadline', e.target.value)} /></div>
              <div><Label>CTA Label</Label><Input value={settings.hero_cta_label || ''} onChange={e => updateField('hero_cta_label', e.target.value)} /></div>
              <div><Label>CTA URL</Label><Input value={settings.hero_cta_url || ''} onChange={e => updateField('hero_cta_url', e.target.value)} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader><CardTitle>Social & Contact</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Contact Email</Label><Input value={settings.contact_email || ''} onChange={e => updateField('contact_email', e.target.value)} /></div>
              <div><Label>Contact Phone</Label><Input value={settings.contact_phone || ''} onChange={e => updateField('contact_phone', e.target.value)} /></div>
              <div><Label>Address</Label><Textarea value={settings.address || ''} onChange={e => updateField('address', e.target.value)} /></div>
              <div><Label>X (Twitter)</Label><Input value={settings.social_x || ''} onChange={e => updateField('social_x', e.target.value)} /></div>
              <div><Label>LinkedIn</Label><Input value={settings.social_linkedin || ''} onChange={e => updateField('social_linkedin', e.target.value)} /></div>
              <div><Label>Instagram</Label><Input value={settings.social_instagram || ''} onChange={e => updateField('social_instagram', e.target.value)} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Primary Color</Label><Input value={settings.primary_color || ''} onChange={e => updateField('primary_color', e.target.value)} /></div>
              <div><Label>Secondary Color</Label><Input value={settings.secondary_color || ''} onChange={e => updateField('secondary_color', e.target.value)} /></div>
              <div><Label>Accent Color</Label><Input value={settings.accent_color || ''} onChange={e => updateField('accent_color', e.target.value)} /></div>
              <div><Label>Heading Font</Label><Input value={settings.font_heading || ''} onChange={e => updateField('font_heading', e.target.value)} /></div>
              <div><Label>Body Font</Label><Input value={settings.font_body || ''} onChange={e => updateField('font_body', e.target.value)} /></div>
              <div><Label>OG Image</Label><ImageUpload value={settings.og_image_url || ''} onChange={v => updateField('og_image_url', v)} folder="og" /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader><CardTitle>Feature Toggles</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><Label>Show Partner Carousel</Label><Switch checked={settings.show_partner_carousel} onCheckedChange={v => updateField('show_partner_carousel', v)} /></div>
              <div className="flex items-center justify-between"><Label>Show Promotions Section</Label><Switch checked={settings.show_promotions_section} onCheckedChange={v => updateField('show_promotions_section', v)} /></div>
              <div className="flex items-center justify-between"><Label>Show Instagram Feed</Label><Switch checked={settings.show_instagram_feed} onCheckedChange={v => updateField('show_instagram_feed', v)} /></div>
              <div className="flex items-center justify-between"><Label>Show LinkedIn Feed</Label><Switch checked={settings.show_linkedin_feed} onCheckedChange={v => updateField('show_linkedin_feed', v)} /></div>
              <div className="flex items-center justify-between"><Label>Mega Menu</Label><Switch checked={settings.is_mega_menu} onCheckedChange={v => updateField('is_mega_menu', v)} /></div>
              <div className="flex items-center justify-between"><Label>Pause Carousel on Hover</Label><Switch checked={settings.partner_carousel_pause_on_hover} onCheckedChange={v => updateField('partner_carousel_pause_on_hover', v)} /></div>
              <div><Label>Partner Carousel Speed</Label><Input type="number" value={settings.partner_carousel_speed || 60} onChange={e => updateField('partner_carousel_speed', parseInt(e.target.value))} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader><CardTitle>SEO & Meta</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Default SEO Title</Label><Input value={settings.seo_default_title || ''} onChange={e => updateField('seo_default_title', e.target.value)} /></div>
              <div><Label>Default SEO Description</Label><Textarea value={settings.seo_default_description || ''} onChange={e => updateField('seo_default_description', e.target.value)} /></div>
              <div><Label>OG Image</Label><ImageUpload value={settings.og_image_url || ''} onChange={v => updateField('og_image_url', v)} folder="og" /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="newsletter">
          <Card>
            <CardHeader><CardTitle>Newsletter & Email</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Newsletter Provider</Label><Input value={settings.newsletter_provider || ''} onChange={e => updateField('newsletter_provider', e.target.value)} placeholder="e.g. mailerlite" /></div>
              <div><Label>Newsletter List ID</Label><Input value={settings.newsletter_list_id || ''} onChange={e => updateField('newsletter_list_id', e.target.value)} /></div>
              <div><Label>Newsletter Position</Label><Input value={settings.newsletter_position || ''} onChange={e => updateField('newsletter_position', e.target.value)} placeholder="e.g. below_promotions" /></div>
              <div><Label>Email From Name</Label><Input value={settings.email_from_name || ''} onChange={e => updateField('email_from_name', e.target.value)} /></div>
              <div><Label>Email From Address</Label><Input value={settings.email_from_address || ''} onChange={e => updateField('email_from_address', e.target.value)} /></div>
              <div><Label>Email Fallback Provider</Label><Input value={settings.email_fallback_provider || ''} onChange={e => updateField('email_fallback_provider', e.target.value)} /></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteSettingsAdmin;
