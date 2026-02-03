import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import partner logos
import nuffieldLogo from '@/assets/partners/nuffield-foundation.png';
import sbiaLogo from '@/assets/partners/sbia.png';
import perrettLaverLogo from '@/assets/partners/perrett-laver.png';
import gatenbySandersonLogo from '@/assets/partners/gatenby-sanderson.png';
import hbsLogo from '@/assets/partners/hbs.png';
import ulLogo from '@/assets/partners/ul.png';
import abgLogo from '@/assets/partners/abg.png';
import knowledgeBridgeLogo from '@/assets/partners/knowledge-bridge.png';
import cabsLogo from '@/assets/partners/cabs.png';
import kbsLogo from '@/assets/partners/kbs.png';

interface Partner {
  id: string;
  name: string;
  logo_url?: string;
  website_url?: string;
  target_blank: boolean;
  order_index: number;
}

interface PartnerCarouselProps {
  speed?: number;
  pauseOnHover?: boolean;
}

export const PartnerCarousel = ({ speed = 60, pauseOnHover = true }: PartnerCarouselProps) => {
  const [partners, setPartners] = useState<Partner[]>([]);

  // Sample partner data - in production this would come from Supabase
  useEffect(() => {
    setPartners([
      { id: '1', name: 'University of Edinburgh Business School', logo_url: hbsLogo, website_url: 'https://www.business-school.ed.ac.uk/', target_blank: true, order_index: 1 },
      { id: '2', name: 'Chartered Association of Business Schools', logo_url: cabsLogo, website_url: 'https://charteredabs.org/', target_blank: true, order_index: 2 },
      { id: '3', name: 'King\'s College London Business School', logo_url: kbsLogo, website_url: 'https://www.kcl.ac.uk/business', target_blank: true, order_index: 3 },
      { id: '4', name: 'Scottish Black Academics Interest Group', logo_url: sbiaLogo, website_url: 'https://www.sbia.business-school.ed.ac.uk/', target_blank: true, order_index: 4 },
      { id: '5', name: 'Perrett Laver', logo_url: perrettLaverLogo, website_url: 'https://www.perrettlaver.com/', target_blank: true, order_index: 5 },
      { id: '6', name: 'Nuffield Foundation', logo_url: nuffieldLogo, website_url: 'https://www.nuffieldfoundation.org/', target_blank: true, order_index: 6 },
      { id: '7', name: 'Gatenby Sanderson', logo_url: gatenbySandersonLogo, website_url: 'https://www.gatenbysanderson.com/', target_blank: true, order_index: 7 },
      { id: '8', name: 'University of Leicester School of Business', logo_url: ulLogo, website_url: 'https://le.ac.uk/school-of-business', target_blank: true, order_index: 8 },
      { id: '9', name: 'Nottingham University Business School', logo_url: abgLogo, website_url: 'https://www.nottingham.ac.uk/business/', target_blank: true, order_index: 9 },
      { id: '10', name: 'Knowledge Bridge', logo_url: knowledgeBridgeLogo, website_url: 'https://www.knowledge-bridge.co.uk/', target_blank: true, order_index: 10 }
    ]);
  }, []);

  if (partners.length === 0) return null;

  return (
    <section className="bg-background border-y border-border" aria-label="Featured In">
      <div className="flex flex-col lg:flex-row">
        {/* Left Label */}
        <div className="lg:w-64 flex-shrink-0 flex items-center justify-center lg:justify-start border-r border-border px-8 py-6 lg:py-12 bg-muted/30">
          <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
            Featured in
          </h3>
        </div>
        
        {/* Partner Logos Carousel */}
        <div className="flex-1 relative overflow-hidden py-8 lg:py-12">
          {/* Navigation Arrows */}
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Previous partners"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Next partners"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
          
          {/* Scrolling logos */}
          <div className="flex items-center justify-center gap-12 px-16">
            {partners.slice(0, 5).map((partner) => (
              <div key={partner.id} className="flex-shrink-0">
                {partner.website_url ? (
                  <a
                    href={partner.website_url}
                    target={partner.target_blank ? "_blank" : undefined}
                    rel={partner.target_blank ? "noopener noreferrer" : undefined}
                    className="block focus:outline-none focus:ring-2 focus:ring-accent rounded"
                    aria-label={`Visit ${partner.name} website`}
                  >
                    {partner.logo_url ? (
                      <img
                        src={partner.logo_url}
                        alt={partner.name}
                        className="h-10 md:h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-foreground font-medium">{partner.name}</span>
                    )}
                  </a>
                ) : (
                  partner.logo_url ? (
                    <img
                      src={partner.logo_url}
                      alt={partner.name}
                      className="h-10 md:h-12 w-auto object-contain opacity-70"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-foreground font-medium">{partner.name}</span>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
