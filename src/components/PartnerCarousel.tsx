import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Partner {
  id: string;
  name: string;
  logo_url?: string | null;
  website_url?: string | null;
  target_blank: boolean | null;
  order_index: number | null;
}

interface PartnerCarouselProps {
  speed?: number;
  pauseOnHover?: boolean;
}

export const PartnerCarousel = ({ speed = 60, pauseOnHover = true }: PartnerCarouselProps) => {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      const { data } = await supabase
        .from('partners')
        .select('id, name, logo_url, website_url, target_blank, order_index')
        .eq('is_active', true)
        .eq('carousel_visible', true)
        .order('order_index', { ascending: true });
      if (data) setPartners(data);
    };
    fetchPartners();
  }, []);

  if (partners.length === 0) return null;

  const doubledPartners = [...partners, ...partners];
  const animationDuration = `${speed}s`;

  return (
    <section className="bg-background border-y border-border" aria-label="Featured In">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-64 flex-shrink-0 flex items-center justify-center lg:justify-start border-r border-border px-8 py-6 lg:py-12 bg-muted/30">
          <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
            Partners & Sponsors
          </h3>
        </div>
        
        <div className="flex-1 relative overflow-hidden py-8 lg:py-12">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
          
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
