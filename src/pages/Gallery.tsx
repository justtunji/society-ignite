import { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { X, ArrowRight, ExternalLink, Calendar, MapPin } from "lucide-react";
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
}

interface EventItem {
  id: string;
  title: string;
  start_datetime: string | null;
  location_text: string | null;
  description: string | null;
  registration_url: string | null;
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    document.title = "Gallery | Society of Black Academics";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'View photos from past Society of Black Academics events, conferences, workshops, and community gatherings.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'View photos from past Society of Black Academics events, conferences, workshops, and community gatherings.';
      document.head.appendChild(meta);
    }

    const fetchGallery = async () => {
      const { data } = await supabase
        .from('gallery_items')
        .select('id, title, image_url, caption')
        .eq('visible', true)
        .order('display_order', { ascending: true });
      if (data) setGalleryImages(data);
    };

    const fetchEvents = async () => {
      const { data } = await supabase
        .from('events')
        .select('id, title, start_datetime, location_text, description, registration_url')
        .eq('status', 'active')
        .order('start_datetime', { ascending: true })
        .limit(5);
      if (data) setUpcomingEvents(data);
    };

    fetchGallery();
    fetchEvents();
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen">
      <Header logoUrl={sbaLogo} siteName="Society of Black Academics" />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center bg-primary">
          <div className="absolute inset-0">
            <img 
              src={galleryHero} 
              alt="Gallery of Academic Events"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-primary/80"></div>
          </div>
          
          <div className="relative z-10 container-wide py-32">
            <div className="max-w-3xl">
              <p className="text-accent font-medium text-lg mb-4">Our Moments</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary-foreground mb-6">
                Capturing Excellence.
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed">
                Explore moments from our past events, conferences, and community gatherings that showcase the vibrant spirit of the Society of Black Academics.
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container-wide">
            <div className="text-center mb-16">
              <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Gallery</h4>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                Photos from Past Events
              </h2>
            </div>
            
            {galleryImages.length === 0 ? (
              <p className="text-center text-muted-foreground">No gallery items yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryImages.map((image) => (
                  <div 
                    key={image.id}
                    className="group relative aspect-[4/3] overflow-hidden cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-all duration-300 flex items-end">
                      <div className="p-6 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                        <h3 className="font-bold text-lg">{image.title}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Lightbox Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-7xl w-full p-0 overflow-hidden bg-black/95 border-none">
            {selectedImage && (
              <div className="relative">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
                <div className="flex items-center justify-center min-h-[80vh] p-8">
                  <div className="w-full max-w-6xl">
                    <img
                      src={selectedImage.image_url}
                      alt={selectedImage.title}
                      className="w-full h-auto max-h-[75vh] object-contain"
                    />
                    <div className="mt-6 text-center text-white space-y-2">
                      <h3 className="text-2xl font-bold">{selectedImage.title}</h3>
                      {selectedImage.caption && <p className="text-white/80">{selectedImage.caption}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Register for Events */}
        {upcomingEvents.length > 0 && (
          <section className="py-20 lg:py-32 bg-muted/30">
            <div className="container-wide">
              <div className="text-center mb-16">
                <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Upcoming</h4>
                <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                  Register for Our Events
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
                  Be part of our growing community and join us at our upcoming conferences, workshops, and networking events.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="bg-background p-8 border-l-4 border-accent hover:shadow-lg transition-shadow">
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
                        Register
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 lg:py-32 bg-primary text-primary-foreground">
          <div className="container-wide text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Join Our Community
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-3xl mx-auto">
              Be part of our growing community and create memories at our upcoming conferences, workshops, and networking events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 py-6 text-lg"
              >
                <a href="/join-us">
                  Become a Member
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary rounded-full px-10 py-6 text-lg"
              >
                <a href="/contact">
                  Contact Us
                </a>
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
