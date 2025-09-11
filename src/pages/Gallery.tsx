import { useEffect } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
      src: "https://societyofblackacademics.com/wp-content/uploads/2025/07/SBA1.jpeg",
      title: "4th Annual SBA conference hosted by The University of Bristol",
      caption: "Bringing together academics and professionals for networking and knowledge sharing"
    },
    {
      src: "https://societyofblackacademics.com/wp-content/uploads/2025/07/SBA2.jpeg",
      title: "Joint workshop with Higher Education Policy Institute (HEPI) and GatenbySanderson",
      caption: "Exploring why there are so few Black Professors"
    },
    {
      src: "https://societyofblackacademics.com/wp-content/uploads/2025/07/SBA4.jpeg",
      title: "President and Vice Chancellor of University of Bristol, Professor Evelyn Welch",
      caption: "Giving a Keynote Address at the 2024 SBA conference hosted by Bristol University"
    },
    {
      src: "https://societyofblackacademics.com/wp-content/uploads/2025/07/SBA5.jpeg",
      title: "SBA Conference 2024 hosted by University of Bristol",
      caption: "Engaging discussions and professional development sessions"
    },
    {
      src: "https://societyofblackacademics.com/wp-content/uploads/2025/07/SBA6.jpeg",
      title: "3rd Annual SBA Conference hosted by the University of Leicester",
      caption: "Building community and advancing careers in higher education"
    },
    {
      src: "https://societyofblackacademics.com/wp-content/uploads/2025/07/SBA8.jpeg",
      title: "3rd Annual SBA Conference hosted by the University of Leicester",
      caption: "Collaborative workshops and networking opportunities"
    },
    {
      src: "https://societyofblackacademics.com/wp-content/uploads/2023/09/3-1.jpeg",
      title: "SBA Workshop Session",
      caption: "Interactive discussions on career development and progression"
    },
    {
      src: "https://societyofblackacademics.com/wp-content/uploads/2023/09/6-1.jpeg",
      title: "Conference Networking",
      caption: "Building professional relationships and community connections"
    },
    {
      src: "https://societyofblackacademics.com/wp-content/uploads/2023/09/8-1.jpeg",
      title: "Panel Discussion",
      caption: "Expert insights on diversity and inclusion in higher education"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header logoUrl="/lovable-uploads/logo@2x.png" siteName="Society of Black Academics" />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-b from-background to-muted/20">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="heading-xl mb-6">Gallery</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Explore moments from our past events, conferences, and community gatherings that showcase the vibrant spirit of the Society of Black Academics.
              </p>
            </div>
          </div>
        </section>

        {/* Photos from Past Events */}
        <section className="section-padding">
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
        <section className="section-padding bg-muted/20">
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