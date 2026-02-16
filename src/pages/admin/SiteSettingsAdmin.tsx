import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SiteSettingsAdmin = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('site_settings').select('*').limit(1).single();
      if (data) setSettings(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase.from('site_settings').update(settings).eq('id', settings.id);
    if (error) {
      toast({ title: 'Error saving', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Settings saved!' });
    }
    setSaving(false);
  };

  const updateField = (field: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  if (loading) return <p>Loading...</p>;
  if (!settings) return <p>No settings found.</p>;

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
              <div><Label>Partner Carousel Speed</Label><Input type="number" value={settings.partner_carousel_speed || 60} onChange={e => updateField('partner_carousel_speed', parseInt(e.target.value))} /></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteSettingsAdmin;
