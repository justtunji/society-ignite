import { useEffect, useState } from 'react';

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

  useEffect(() => {
    setPartners([
      { id: '1', name: 'University of Edinburgh Business School', logo_url: hbsLogo, website_url: 'https://www.business-school.ed.ac.uk/', target_blank: true, order_index: 1 },
      { id: '2', name: 'Chartered Association of Business Schools', logo_url: cabsLogo, website_url: 'https://charteredabs.org/', target_blank: true, order_index: 2 },
      { id: '3', name: "King's College London Business School", logo_url: kbsLogo, website_url: 'https://www.kcl.ac.uk/business', target_blank: true, order_index: 3 },
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

  // Double the partners for seamless infinite scroll
  const doubledPartners = [...partners, ...partners];

  const animationDuration = `${speed}s`;

  return (
    <section className="bg-background border-y border-border" aria-label="Featured In">
      <div className="flex flex-col lg:flex-row">
        {/* Left Label */}
        <div className="lg:w-64 flex-shrink-0 flex items-center justify-center lg:justify-start border-r border-border px-8 py-6 lg:py-12 bg-muted/30">
          <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
            Partners & Sponsors
          </h3>
        </div>
        
        {/* Partner Logos Carousel */}
        <div className="flex-1 relative overflow-hidden py-8 lg:py-12">
          {/* Gradient fades */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
          
          {/* Scrolling logos */}
          <div 
            className="partner-track"
            style={{ 
              animationDuration,
              animationPlayState: pauseOnHover ? undefined : 'running'
            }}
          >
            {doubledPartners.map((partner, index) => (
              <div key={`${partner.id}-${index}`} className="flex-shrink-0 mx-8">
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
