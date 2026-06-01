import { useEffect, useMemo, useState } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { X, ArrowRight, ArrowLeft, ExternalLink, Calendar, MapPin, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import galleryHero from "@/assets/images/gallery-hero.jpg";
import sbaLogo from "@/assets/logos/sba-logo.png";

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  caption: string | null;
  category: string | null;
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
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

    supabase
      .from('gallery_items')
      .select('id, title, image_url, caption, category, photographer_credit')
      .eq('visible', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => { if (data) setGalleryImages(data as GalleryItem[]); });

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

  const filtered = useMemo(() => {
    if (activeCategory === ALL) return galleryImages;
    return galleryImages.filter(i => (i.category || '').trim() === activeCategory);
  }, [galleryImages, activeCategory]);

  const openLightbox = (id: string) => {
    const idx = filtered.findIndex(i => i.id === id);
    if (idx >= 0) setLightboxIndex(idx);
  };
  const close = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex(i => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
  const next = () => setLightboxIndex(i => (i === null ? i : (i + 1) % filtered.length));

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, filtered.length]);

  const formatDate = (s: string | null) =>
    !s ? 'TBD' : new Date(s).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const selected = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <div className="min-h-screen">
      <Header logoUrl={sbaLogo} siteName="Society of Black Academics" />

      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center bg-primary">
          <div className="absolute inset-0">
            <img
              src={galleryHero}
              alt=""
              className="w-full h-full object-cover opacity-30"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
          </div>
          <div className="relative z-10 container-wide py-28">
            <div className="max-w-3xl">
              <p className="text-accent font-medium text-lg mb-4">Our Moments</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary-foreground mb-6">
                Capturing Excellence.
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed">
                Explore moments from our conferences, workshops, and community gatherings.
              </p>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container-wide">
            <div className="text-center mb-10">
              <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">Gallery</h4>
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground">Photos from Past Events</h2>
            </div>

            {/* Category filter */}
            {categories.length > 1 && (
              <div
                role="tablist"
                aria-label="Filter gallery by category"
                className="flex flex-wrap justify-center gap-2 mb-10"
              >
                {categories.map(cat => {
                  const active = cat === activeCategory;
                  return (
                    <button
                      key={cat}
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveCategory(cat)}
                      className={`min-h-11 px-5 rounded-full text-sm font-medium border transition-colors ${
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

            {filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-16">No gallery items yet.</p>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]">
                {filtered.map((image, i) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => openLightbox(image.id)}
                    aria-label={`Open image: ${image.title}`}
                    className="group relative mb-4 block w-full overflow-hidden rounded-lg break-inside-avoid focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <img
                      src={image.image_url}
                      alt={image.title}
                      loading={i < 6 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                      <div className="text-primary-foreground">
                        <h3 className="font-bold text-base leading-tight">{image.title}</h3>
                        {image.category && (
                          <p className="text-xs text-accent mt-1 uppercase tracking-wider">{image.category}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Lightbox */}
        <Dialog open={selected !== null} onOpenChange={(o) => !o && close()}>
          <DialogContent className="max-w-7xl w-full p-0 overflow-hidden bg-black/95 border-none">
            {selected && (
              <div className="relative">
                <button
                  onClick={close}
                  aria-label="Close lightbox"
                  className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors min-h-11 min-w-11 flex items-center justify-center"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
                {filtered.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      aria-label="Previous image"
                      className="absolute top-1/2 -translate-y-1/2 left-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors min-h-11 min-w-11 flex items-center justify-center"
                    >
                      <ArrowLeft className="h-6 w-6 text-white" />
                    </button>
                    <button
                      onClick={next}
                      aria-label="Next image"
                      className="absolute top-1/2 -translate-y-1/2 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors min-h-11 min-w-11 flex items-center justify-center"
                    >
                      <ArrowRight className="h-6 w-6 text-white" />
                    </button>
                  </>
                )}
                <div className="flex items-center justify-center min-h-[80vh] p-6 md:p-10">
                  <div className="w-full max-w-6xl">
                    <img
                      src={selected.image_url}
                      alt={selected.title}
                      className="w-full h-auto max-h-[75vh] object-contain"
                    />
                    <div className="mt-5 text-center text-white space-y-1">
                      <h3 className="text-xl md:text-2xl font-bold">{selected.title}</h3>
                      {selected.caption && <p className="text-white/80 text-sm md:text-base">{selected.caption}</p>}
                      {selected.photographer_credit && (
                        <p className="text-white/60 text-xs flex items-center justify-center gap-1.5 pt-1">
                          <Camera className="h-3 w-3" /> {selected.photographer_credit}
                        </p>
                      )}
                      {filtered.length > 1 && (
                        <p className="text-white/50 text-xs pt-2">
                          {(lightboxIndex ?? 0) + 1} / {filtered.length}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
                  <div key={event.id} className="bg-background p-8 border-l-4 border-accent hover:shadow-lg transition-shadow rounded-r-lg">
                    <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <Calendar className="h-4 w-4 text-accent" />
                      <span>{formatDate(event.start_datetime)}</span>
                    </div>
                    {event.location_text && (
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                        <MapPin className="h-4 w-4 text-accent" />
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
                      <a href={event.registration_url || '/contact'}>
                        Register <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
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
                <a href="/join-us">Become a Member <ArrowRight className="ml-2 h-5 w-5" /></a>
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
