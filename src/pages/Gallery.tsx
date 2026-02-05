import { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ResearchTracksSection } from "@/components/ResearchTracksSection";
import galleryHero from "@/assets/images/gallery-hero.jpg";
import sbaLogo from "@/assets/logos/sba-logo.png";
import sba1 from "@/assets/images/gallery/sba1.jpeg";
import sba2 from "@/assets/images/gallery/sba2.jpeg";
import sba3 from "@/assets/images/gallery/sba4.jpeg";
import sba4 from "@/assets/images/gallery/sba5.jpeg";
import sba5 from "@/assets/images/gallery/sba6.jpeg";
import sba6 from "@/assets/images/gallery/sba8.jpeg";
import sba7 from "@/assets/images/gallery/sba-event-3.jpeg";
import sba8 from "@/assets/images/gallery/sba-event-6.jpeg";
import sba9 from "@/assets/images/gallery/sba-event-8.jpeg";
import heroImage from "@/assets/images/hero-image.jpg";
import sba11 from "@/assets/images/gallery/sba-new-11.jpeg";
import sba12 from "@/assets/images/gallery/sba-new-12.jpeg";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string; caption: string } | null>(null);

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
  }, []);

  const galleryImages = [
    { src: sba1, title: "SBA Conference Attendees", caption: "Academics engaged during SBA conference session" },
    { src: sba2, title: "Conference Session", caption: "Attendees listening to a keynote presentation" },
    { src: sba3, title: "Conference Audience", caption: "Black academics gathered at SBA annual conference" },
    { src: sba4, title: "Networking Session", caption: "Members networking during conference break" },
    { src: sba5, title: "SBA Leadership Team", caption: "Society of Black Academics leadership team" },
    { src: sba6, title: "Panel Discussion", caption: "Expert panel discussion at SBA event" },
    { src: sba7, title: "SBA Banner", caption: "Driving systematic change in higher education" },
    { src: sba8, title: "Member Networking", caption: "Members networking at SBA event" },
    { src: sba9, title: "Group Photo", caption: "SBA Conference 2024 group photo" },
    { src: heroImage, title: "Financial Flourishing Session", caption: "Panel session on Financial Flourishing at King's Business School" },
    { src: sba11, title: "Young Scholars Presentation", caption: "Young academics presenting at SBA event" },
    { src: sba12, title: "5th Annual Conference", caption: "SBA 2025 5th Conference attendees celebrating" }
  ];

  return (
    <div className="min-h-screen">
      <Header logoUrl={sbaLogo} siteName="Society of Black Academics" />
      
      <main>
        {/* Hero Section - DINN Style */}
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
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((image, index) => (
                <div 
                  key={index}
                  className="group relative aspect-[4/3] overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.src}
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
                      src={selectedImage.src}
                      alt={selectedImage.title}
                      className="w-full h-auto max-h-[75vh] object-contain"
                    />
                    <div className="mt-6 text-center text-white space-y-2">
                      <h3 className="text-2xl font-bold">{selectedImage.title}</h3>
                      <p className="text-white/80">{selectedImage.caption}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Research Tracks Section */}
        <ResearchTracksSection />

        {/* Call to Action */}
        <section className="py-20 lg:py-32 bg-primary text-primary-foreground">
          <div className="container-wide text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Join Our Next Event
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
        footerBlurb="Driving inclusive change in the Higher Education sector through community, networking, and professional development."
      />
    </div>
  );
};

export default Gallery;
