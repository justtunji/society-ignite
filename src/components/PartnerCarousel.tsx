import { useEffect, useState } from 'react';

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
      { id: '1', name: 'Harvard University', logo_url: 'https://logos-world.net/wp-content/uploads/2021/09/Harvard-Logo.png', website_url: 'https://harvard.edu', target_blank: true, order_index: 1 },
      { id: '2', name: 'Stanford University', logo_url: 'https://identity.stanford.edu/wp-content/uploads/sites/3/2020/07/block-s-right.png', website_url: 'https://stanford.edu', target_blank: true, order_index: 2 },
      { id: '3', name: 'MIT', logo_url: 'https://web.mit.edu/graphicidentity/logo/logo.svg', website_url: 'https://mit.edu', target_blank: true, order_index: 3 },
      { id: '4', name: 'Yale University', logo_url: 'https://yaleidentity.yale.edu/sites/default/files/Y%20logo.svg', website_url: 'https://yale.edu', target_blank: true, order_index: 4 },
      { id: '5', name: 'Princeton University', logo_url: 'https://communications.princeton.edu/sites/default/files/styles/full_node/public/images/2022/02/princeton-university-shield.png', website_url: 'https://princeton.edu', target_blank: true, order_index: 5 },
      { id: '6', name: 'Columbia University', logo_url: 'https://columbia.edu/content/themes/custom/columbia/assets/img/columbia-crown.svg', website_url: 'https://columbia.edu', target_blank: true, order_index: 6 },
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