import { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PartnerCarousel } from "@/components/PartnerCarousel";
import { PromotionsSection } from "@/components/PromotionsSection";
import { FeaturedPrograms } from "@/components/FeaturedPrograms";
import { NuffieldAnnouncement } from "@/components/NuffieldAnnouncement";
import { PastEventsSection } from "@/components/PastEventsSection";
import { NewsletterSection } from "@/components/NewsletterSection";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  site_name: string;
  logo_url?: string;
  hero_headline: string;
  hero_subheadline?: string;
  hero_cta_label: string;
  hero_cta_url: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  social_x?: string;
  social_linkedin?: string;
  social_instagram?: string;
  footer_blurb?: string;
  show_partner_carousel: boolean;
  partner_carousel_speed: number;
  partner_carousel_pause_on_hover: boolean;
  show_promotions_section: boolean;
}

const Index = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    site_name: 'Society of Black Academics',
    hero_headline: 'Driving Inclusive Change\nIn Higher Education Sector',
    hero_subheadline: 'Join a community of scholars, researchers, and educators committed to advancing diversity and excellence in academia.',
    hero_cta_label: 'Join the Network',
    hero_cta_url: '/contact',
    show_partner_carousel: true,
    partner_carousel_speed: 60,
    partner_carousel_pause_on_hover: true,
    show_promotions_section: true,
  });

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('public_site_settings')
          .select('*')
          .single();

        if (error) {
          console.error('Error fetching site settings:', error);
          return;
        }

        if (data) {
          setSiteSettings(data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchSiteSettings();
  }, []);

  return (
    <div className="min-h-screen">
      <Header 
        logoUrl={siteSettings.logo_url} 
        siteName={siteSettings.site_name}
      />
      
      <main>
        <HeroSection
          headline={siteSettings.hero_headline}
          subheadline={siteSettings.hero_subheadline}
          ctaLabel={siteSettings.hero_cta_label}
          ctaUrl={siteSettings.hero_cta_url}
        />

        {siteSettings.show_partner_carousel && (
          <PartnerCarousel 
            speed={siteSettings.partner_carousel_speed}
            pauseOnHover={siteSettings.partner_carousel_pause_on_hover}
          />
        )}

        {siteSettings.show_promotions_section && (
          <PromotionsSection />
        )}

        <NuffieldAnnouncement />

        <PastEventsSection />

        <FeaturedPrograms />

        <NewsletterSection />
      </main>

      <Footer
        siteName={siteSettings.site_name}
        contactEmail={siteSettings.contact_email}
        contactPhone={siteSettings.contact_phone}
        address={siteSettings.address}
        socialX={siteSettings.social_x}
        socialLinkedin={siteSettings.social_linkedin}
        socialInstagram={siteSettings.social_instagram}
        footerBlurb={siteSettings.footer_blurb}
      />
    </div>
  );
};

export default Index;
