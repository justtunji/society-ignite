import { useEffect } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import galleryHero from "@/assets/images/gallery-hero.jpg";
import sbaLogo from "@/assets/logos/sba-logo.png";
import sba1 from "@/assets/images/gallery/sba1.jpeg";
import sba2 from "@/assets/images/gallery/sba2.jpeg";
import sba4 from "@/assets/images/gallery/sba4.jpeg";
import sba5 from "@/assets/images/gallery/sba5.jpeg";
import sba6 from "@/assets/images/gallery/sba6.jpeg";
import sba8 from "@/assets/images/gallery/sba8.jpeg";
import sbaEvent3 from "@/assets/images/gallery/sba-event-3.jpeg";
import sbaEvent6 from "@/assets/images/gallery/sba-event-6.jpeg";
import sbaEvent8 from "@/assets/images/gallery/sba-event-8.jpeg";

const Gallery = () => {
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
    {
      src: sba1,
      title: "4th Annual SBA conference hosted by The University of Bristol",
      caption: "Bringing together academics and professionals for networking and knowledge sharing"
    },
    {
      src: sba2,
      title: "Joint workshop with Higher Education Policy Institute (HEPI) and GatenbySanderson",
      caption: "Exploring why there are so few Black Professors"
    },
    {
      src: sba4,
      title: "President and Vice Chancellor of University of Bristol, Professor Evelyn Welch",
      caption: "Giving a Keynote Address at the 2024 SBA conference hosted by Bristol University"
    },
    {
      src: sba5,
      title: "SBA Conference 2024 hosted by University of Bristol",
      caption: "Engaging discussions and professional development sessions"
    },
    {
      src: sba6,
      title: "3rd Annual SBA Conference hosted by the University of Leicester",
      caption: "Building community and advancing careers in higher education"
    },
    {
      src: sba8,
      title: "3rd Annual SBA Conference hosted by the University of Leicester",
      caption: "Collaborative workshops and networking opportunities"
    },
    {
      src: sbaEvent3,
      title: "SBA Workshop Session",
      caption: "Interactive discussions on career development and progression"
    },
    {
      src: sbaEvent6,
      title: "Conference Networking",
      caption: "Building professional relationships and community connections"
    },
    {
      src: sbaEvent8,
      title: "Panel Discussion",
      caption: "Expert insights on diversity and inclusion in higher education"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header logoUrl={sbaLogo} siteName="Society of Black Academics" />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img 
              src={galleryHero} 
              alt="Gallery of Academic Events"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/80"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 text-center text-white container-wide animate-fade-in">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Camera className="h-12 w-12 animate-bounce-soft" />
              <h1 className="hero-title">Gallery</h1>
            </div>
            <p className="hero-subtitle max-w-3xl mx-auto">
              Explore moments from our past events, conferences, and community gatherings that showcase the vibrant spirit of the Society of Black Academics.
            </p>
          </div>
        </section>

        {/* Photos from Past Events */}
        <section className="section-padding bg-gradient-to-br from-indigo-50 via-background to-purple-50">
          <div className="container-wide">
            <h2 className="heading-lg mb-12 text-center">Photos from Past Events</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryImages.map((image, index) => (
                <Card key={index} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2 line-clamp-2">{image.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">{image.caption}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="section-padding bg-gradient-to-br from-coral-50 via-background to-teal-50">
          <div className="container-wide">
            <div className="text-center">
              <h2 className="heading-lg mb-6">Join Our Next Event</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Be part of our growing community and create memories at our upcoming conferences, workshops, and networking events.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/join-us"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                >
                  Become a Member
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                >
                  Contact Us
                </a>
              </div>
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