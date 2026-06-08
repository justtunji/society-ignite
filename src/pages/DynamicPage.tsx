import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import PageBlockRenderer from '@/components/PageBlockRenderer';
import type { PageBlock } from '@/lib/pageBlocks';

// Slugs handled by static routes — never resolved against cms_pages.
const RESERVED = new Set([
  'about', 'resources', 'gallery', 'contact', 'join-us', 'programs', 'admin', 'p',
]);

interface CmsPageRow {
  id: string;
  slug: string;
  title: string;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  status: 'draft' | 'published';
  blocks: PageBlock[];
}

const DynamicPage = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const [page, setPage] = useState<CmsPageRow | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    if (!slug || RESERVED.has(slug)) { setPage(null); return; }

    (async () => {
      const { data } = await supabase
        .from('cms_pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      if (cancelled) return;
      setPage((data as any) ?? null);
    })();

    return () => { cancelled = true; };
  }, [slug]);

  // SEO
  useEffect(() => {
    if (!page) return;
    document.title = page.seo_title || page.title;
    const desc = page.seo_description || '';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);
  }, [page]);

  if (page === undefined) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }
  if (page === null) return <Navigate to="/404" replace />;

  const blocks = Array.isArray(page.blocks) ? page.blocks : [];
  const hasHeroBlock = blocks[0]?.type === 'hero';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20 pb-16">
        {!hasHeroBlock && (
          <section className="container mx-auto px-4 pt-8 pb-4">
            <h1 className="text-4xl md:text-5xl font-bold">{page.title}</h1>
          </section>
        )}
        <PageBlockRenderer blocks={blocks} />
      </main>
      <Footer />
    </div>
  );
};

export default DynamicPage;
