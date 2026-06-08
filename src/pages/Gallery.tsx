import { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { X, ArrowRight, ArrowLeft, ExternalLink, Calendar, MapPin, Camera, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/integrations/supabase/client';
import galleryHero from "@/assets/images/gallery-hero.jpg";
import sbaLogo from "@/assets/logos/sba-logo.png";
import { cldUrl, cldSrcSet } from '@/lib/cloudinary';
import { useSectionContent } from "@/hooks/useSectionContent";

const HERO_DEFAULTS = {
  eyebrow: 'Our Moments',
  headline: 'Capturing Excellence.',
  subheadline: 'Explore moments from our conferences, workshops, and community gatherings.',
  image_url: '',
  cta_label: '', cta_url: '',
  featured_item_id: null as string | null,
};
const PAST_DEFAULTS = {
  eyebrow: 'Gallery',
  headline: 'Photos from Past Events',
  curated_items: [] as Array<{ id: string; visible: boolean }>,
};

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  caption: string | null;
  category: string | null;
  tags: string[] | null;
  photographer_credit: string | null;
}

interface EventItem {
  id: string;
  title: string;
  start_datetime: string | null;
  location_text: string | null;
  description: string | null;
  registration_url: string | null;
}

const ALL = 'All';

const Gallery = () => {
  const hero = useSectionContent('gallery', 'hero', HERO_DEFAULTS);
  const pastIntro = useSectionContent('gallery', 'past_events_intro', PAST_DEFAULTS);
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    document.title = "Gallery | Society of Black Academics";
    const desc = 'Photos from Society of Black Academics events, conferences, workshops, and community gatherings.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);

    setLoading(true);
    supabase
      .from('gallery_items')
      .select('id, title, image_url, caption, category, tags, photographer_credit, display_order')
      .eq('visible', true)
      .order('category', { ascending: true, nullsFirst: false })
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data) setGalleryImages(data as GalleryItem[]);
        setLoading(false);
      });

    supabase
      .from('events')
      .select('id, title, start_datetime, location_text, description, registration_url')
      .eq('status', 'active')
      .order('start_datetime', { ascending: true })
      .limit(5)
      .then(({ data }) => { if (data) setUpcomingEvents(data); });
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    galleryImages.forEach(i => { if (i.category?.trim()) set.add(i.category.trim()); });
    return [ALL, ...Array.from(set).sort()];
  }, [galleryImages]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    galleryImages.forEach(i => i.tags?.forEach(t => { if (t?.trim()) set.add(t.trim()); }));
    return Array.from(set).sort();
  }, [galleryImages]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return galleryImages.filter(i => {
      if (activeCategory !== ALL && (i.category || '').trim() !== activeCategory) return false;
      if (activeTags.size > 0) {
        const itemTags = new Set((i.tags || []).map(t => t.trim()));
        for (const t of activeTags) if (!itemTags.has(t)) return false;
      }
      if (q) {
        const hay = [i.title, i.caption, i.category, i.photographer_credit, ...(i.tags || [])]
          .filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [galleryImages, activeCategory, activeTags, search]);

  const toggleTag = (t: string) => {
    setActiveTags(prev => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  };

  const openLightbox = (id: string, trigger?: HTMLButtonElement) => {
    const idx = filtered.findIndex(i => i.id === id);
    if (idx >= 0) {
      lastTriggerRef.current = trigger || null;
      setLightboxIndex(idx);
    }
  };
  const close = () => {
    setLightboxIndex(null);
    // Return focus to the originating tile
    setTimeout(() => lastTriggerRef.current?.focus(), 0);
  };
  const prev = () => setLightboxIndex(i => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
  const next = () => setLightboxIndex(i => (i === null ? i : (i + 1) % filtered.length));

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, filtered.length]);

  // Keyboard arrow navigation across category tabs
  const onTabsKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const buttons = Array.from(tabsRef.current?.querySelectorAll<HTMLButtonElement>('button[role="tab"]') ?? []);
    const idx = buttons.findIndex(b => b === document.activeElement);
    if (idx < 0) return;
    e.preventDefault();
    const next = e.key === 'ArrowRight' ? (idx + 1) % buttons.length : (idx - 1 + buttons.length) % buttons.length;
    buttons[next].focus();
  };

  const formatDate = (s: string | null) =>
    !s ? 'TBD' : new Date(s).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const selected = lightboxIndex !== null ? filtered[lightboxIndex] : null;
  const hasFilters = search.trim() !== '' || activeCategory !== ALL || activeTags.size > 0;
  const clearFilters = () => { setSearch(''); setActiveCategory(ALL); setActiveTags(new Set()); };

  return (
    <div className="min-h-screen">
      <a href="#gallery-grid" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded">
        Skip to gallery
      </a>
      <Header logoUrl={sbaLogo} siteName="Society of Black Academics" />

      <main>
        {/* Hero */}
        {hero && (
          <section className="relative min-h-[70vh] flex items-center bg-primary">
            <div className="absolute inset-0">
              <img
                src={hero.image_url || galleryHero}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover opacity-30"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
            </div>
            <div className="relative z-10 container-wide py-28">
              <div className="max-w-3xl">
                {hero.eyebrow && <p className="text-accent font-medium text-lg mb-4">{hero.eyebrow}</p>}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary-foreground mb-6">
                  {hero.headline}
                </h1>
                {hero.subheadline && (
                  <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed">
                    {hero.subheadline}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Gallery */}
        <section id="gallery-grid" className="py-16 lg:py-24 bg-background">
          <div className="container-wide">
            {pastIntro && (
              <div className="text-center mb-10">
                {pastIntro.eyebrow && (
                  <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">{pastIntro.eyebrow}</h4>
                )}
                <h2 className="text-3xl lg:text-5xl font-bold text-foreground">{pastIntro.headline}</h2>
              </div>
            )}

            {/* Search */}
            <div className="max-w-xl mx-auto mb-6">
              <label htmlFor="gallery-search" className="sr-only">Search gallery</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="gallery-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, caption, tag, photographer…"
                  className="pl-9 h-11 rounded-full"
                  aria-controls="gallery-grid-list"
                />
              </div>
            </div>

            {/* Category filter */}
            {categories.length > 1 && (
              <div
                ref={tabsRef}
                role="tablist"
                aria-label="Filter gallery by category"
                onKeyDown={onTabsKey}
                className="flex flex-wrap justify-center gap-2 mb-4"
              >
                {categories.map(cat => {
                  const active = cat === activeCategory;
                  return (
                    <button
                      key={cat}
                      role="tab"
                      aria-selected={active}
                      tabIndex={active ? 0 : -1}
                      onClick={() => setActiveCategory(cat)}
                      className={`min-h-11 px-5 rounded-full text-sm font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        active
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-foreground border-border hover:border-accent hover:text-accent-foreground hover:bg-accent'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tag filter */}
            {allTags.length > 0 && (
              <div role="group" aria-label="Filter gallery by tag" className="flex flex-wrap justify-center gap-2 mb-6">
                {allTags.map(t => {
                  const active = activeTags.has(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleTag(t)}
                      className={`min-h-9 px-3 rounded-full text-xs font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        active
                          ? 'bg-accent text-accent-foreground border-accent'
                          : 'bg-muted text-muted-foreground border-transparent hover:text-foreground'
                      }`}
                    >
                      #{t}
                    </button>
                  );
                })}
              </div>
            )}

            {hasFilters && (
              <div className="text-center mb-8" aria-live="polite">
                <span className="text-sm text-muted-foreground mr-3">
                  {filtered.length} {filtered.length === 1 ? 'photo' : 'photos'}
                </span>
                <button onClick={clearFilters} className="text-sm font-medium text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
                  Clear filters
                </button>
              </div>
            )}

            {loading ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="mb-4 w-full break-inside-avoid rounded-lg"
                    style={{ height: `${180 + ((i * 47) % 160)}px` }}
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-16">No photos match your filters.</p>
            ) : (
              <ul
                id="gallery-grid-list"
                aria-label="Gallery photos"
                className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance] list-none p-0 m-0"
              >
                {filtered.map((image, i) => (
                  <li key={image.id} className="mb-4 break-inside-avoid">
                    <button
                      type="button"
                      onClick={(e) => openLightbox(image.id, e.currentTarget)}
                      aria-label={`Open image: ${image.title}${image.category ? `, ${image.category}` : ''}`}
                      className="group relative block w-full overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    >
                      <img
                        src={cldUrl(image.image_url, { w: 800, c: 'fit' })}
                        srcSet={cldSrcSet(image.image_url, [400, 640, 800, 1200], { c: 'fit' })}
                        alt={image.title}
                        loading={i < 4 ? 'eager' : 'lazy'}
                        decoding="async"
                        fetchPriority={i < 2 ? 'high' : 'auto'}
                        sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03] bg-muted"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 flex items-end p-5 pointer-events-none">
                        <div className="text-primary-foreground">
                          <h3 className="font-bold text-base leading-tight">{image.title}</h3>
                          {image.category && (
                            <p className="text-xs text-accent mt-1 uppercase tracking-wider">{image.category}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Lightbox */}
        <Dialog open={selected !== null} onOpenChange={(o) => !o && close()}>
          <DialogContent
            className="max-w-7xl w-full p-0 overflow-hidden bg-black/95 border-none"
            aria-describedby="lightbox-desc"
          >
            {selected && (
              <>
                <DialogTitle className="sr-only">{selected.title}</DialogTitle>
                <DialogDescription id="lightbox-desc" className="sr-only">
                  {selected.caption || 'Gallery image'} — image {(lightboxIndex ?? 0) + 1} of {filtered.length}. Use left and right arrow keys to navigate, escape to close.
                </DialogDescription>
                <div className="relative">
                  {filtered.length > 1 && (
                    <>
                      <button
                        onClick={prev}
                        aria-label="Previous image"
                        className="absolute top-1/2 -translate-y-1/2 left-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors min-h-11 min-w-11 flex items-center justify-center"
                      >
                        <ArrowLeft className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                      <button
                        onClick={next}
                        aria-label="Next image"
                        className="absolute top-1/2 -translate-y-1/2 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors min-h-11 min-w-11 flex items-center justify-center"
                      >
                        <ArrowRight className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </>
                  )}
                  <div className="flex items-center justify-center min-h-[80vh] p-6 md:p-10">
                    <div className="w-full max-w-6xl">
                      <img
                        src={cldUrl(selected.image_url, { w: 1600, c: 'fit' })}
                        srcSet={cldSrcSet(selected.image_url, [800, 1200, 1600, 2000], { c: 'fit' })}
                        sizes="90vw"
                        alt={selected.title}
                        decoding="async"
                        className="w-full h-auto max-h-[75vh] object-contain"
                      />
                      <div className="mt-5 text-center text-white space-y-1">
                        <h3 className="text-xl md:text-2xl font-bold">{selected.title}</h3>
                        {selected.caption && <p className="text-white/80 text-sm md:text-base">{selected.caption}</p>}
                        {selected.photographer_credit && (
                          <p className="text-white/60 text-xs flex items-center justify-center gap-1.5 pt-1">
                            <Camera className="h-3 w-3" aria-hidden="true" /> {selected.photographer_credit}
                          </p>
                        )}
                        {filtered.length > 1 && (
                          <p className="text-white/50 text-xs pt-2" aria-live="polite">
                            {(lightboxIndex ?? 0) + 1} / {filtered.length}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <section className="py-20 lg:py-28 bg-muted/30">
            <div className="container-wide">
              <div className="text-center mb-14">
                <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">Upcoming</h4>
                <h2 className="text-3xl lg:text-5xl font-bold text-foreground">Register for Our Events</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
                  Join us at our upcoming conferences, workshops, and networking events.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map(event => (
                  <article key={event.id} className="bg-background p-8 border-l-4 border-accent hover:shadow-lg transition-shadow rounded-r-lg">
                    <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <Calendar className="h-4 w-4 text-accent" aria-hidden="true" />
                      <span>{formatDate(event.start_datetime)}</span>
                    </div>
                    {event.location_text && (
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                        <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
                        <span>{event.location_text}</span>
                      </div>
                    )}
                    {event.description && (
                      <p className="text-muted-foreground text-sm mb-6">
                        {event.description.length > 150 ? event.description.slice(0, 150) + '...' : event.description}
                      </p>
                    )}
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-full px-6 hover:bg-accent hover:text-accent-foreground hover:border-accent"
                    >
                      <a href={event.registration_url || '/contact'} aria-label={`Register for ${event.title}`}>
                        Register <ExternalLink className="ml-2 h-3 w-3" aria-hidden="true" />
                      </a>
                    </Button>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 lg:py-28 bg-primary text-primary-foreground">
          <div className="container-wide text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Join Our Community</h2>
            <p className="text-lg text-primary-foreground/80 mb-10 max-w-3xl mx-auto">
              Be part of our growing community and create memories at our upcoming events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 py-6 text-lg">
                <a href="/join-us">Become a Member <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary rounded-full px-10 py-6 text-lg">
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer
        siteName="Society of Black Academics"
        contactEmail="info@societyofblackacademics.com"
        socialLinkedin="https://www.linkedin.com/company/society-of-black-academics/"
        socialX="https://x.com/SocietyBlackAca"
        socialInstagram="https://www.instagram.com/societyofblackacademics/"
        footerBlurb="Driving inclusive change in the Higher Education sector through community, networking, and professional development."
      />
    </div>
  );
};

export default Gallery;
