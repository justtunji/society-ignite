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

  // Duplicate partners for seamless loop
  const duplicatedPartners = [...partners, ...partners];
  
  const animationDuration = `${partners.length * 100 / (speed || 60)}s`;

  return (
    <section className="partner-carousel" aria-label="Partner Universities">
      <div className="container-wide">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium text-foreground mb-2">
            Partnering with Leading Institutions
          </h2>
          <p className="text-muted-foreground">
            Collaborating with top universities to advance academic excellence
          </p>
        </div>
      </div>
      
      <div className="relative overflow-hidden">
        <div 
          className="partner-track"
          style={{
            animationDuration,
            animationPlayState: pauseOnHover ? undefined : 'running'
          }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div key={`${partner.id}-${index}`} className="flex-none">
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
                      className="partner-logo"
                      loading="lazy"
                    />
                  ) : (
                    <div className="partner-logo flex items-center justify-center bg-secondary text-foreground font-medium">
                      {partner.name}
                    </div>
                  )}
                </a>
              ) : (
                partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="partner-logo"
                    loading="lazy"
                  />
                ) : (
                  <div className="partner-logo flex items-center justify-center bg-secondary text-foreground font-medium">
                    {partner.name}
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};