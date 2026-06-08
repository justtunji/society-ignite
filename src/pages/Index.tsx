import { useEffect, useState, lazy, Suspense } from 'react';
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { Footer } from "@/components/Footer";
import { SectionSeoTags } from "@/components/SectionSeoTags";
import { supabase } from "@/integrations/supabase/client";

// Below-the-fold sections are code-split to keep initial JS small.
const PartnerCarousel = lazy(() => import("@/components/PartnerCarousel").then(m => ({ default: m.PartnerCarousel })));
const ConferenceSection = lazy(() => import("@/components/ConferenceSection").then(m => ({ default: m.ConferenceSection })));
const AboutSection = lazy(() => import("@/components/AboutSection").then(m => ({ default: m.AboutSection })));
const ProgrammesSection = lazy(() => import("@/components/ProgrammesSection").then(m => ({ default: m.ProgrammesSection })));
const CommunitiesSection = lazy(() => import("@/components/CommunitiesSection").then(m => ({ default: m.CommunitiesSection })));
const ImpactSection = lazy(() => import("@/components/ImpactSection").then(m => ({ default: m.ImpactSection })));
const NewsletterSection = lazy(() => import("@/components/NewsletterSection").then(m => ({ default: m.NewsletterSection })));

const SectionFallback = () => <div className="h-32" aria-hidden />;

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
      <SectionSeoTags
        pageUrl="/"
        fallbackTitle={`${siteSettings.site_name} — Driving Inclusive Change in Higher Education`}
        fallbackDescription={siteSettings.hero_subheadline}
        sections={[
          ['home', 'conference'],
          ['home', 'programmes_intro'],
          ['home', 'impact'],
        ]}
      />
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
          <Suspense fallback={<SectionFallback />}>
            <PartnerCarousel
              speed={siteSettings.partner_carousel_speed}
              pauseOnHover={siteSettings.partner_carousel_pause_on_hover}
            />
          </Suspense>
        )}

        <Suspense fallback={<SectionFallback />}>
          <ConferenceSection />
          <AboutSection />
          <ProgrammesSection />
          <CommunitiesSection />
          <ImpactSection />
          <NewsletterSection />
        </Suspense>
      </main>

      <Footer
        siteName={siteSettings.site_name}
        contactEmail={siteSettings.contact_email || "info@societyofblackacademics.com"}
        contactPhone={siteSettings.contact_phone}
        address={siteSettings.address}
        socialX={siteSettings.social_x || "https://x.com/SocietyBlackAca"}
        socialLinkedin={siteSettings.social_linkedin || "https://www.linkedin.com/company/society-of-black-academics/"}
        socialInstagram={siteSettings.social_instagram || "https://www.instagram.com/societyofblackacademics/"}
        footerBlurb={siteSettings.footer_blurb}
      />
    </div>
  );
};

export default Index;
