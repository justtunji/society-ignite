import { Button } from "@/components/ui/button";
import { ArrowRight, Handshake } from "lucide-react";
import heroImage from "@/assets/images/hero-image.jpg";
import { PartnerSponsorDialog } from "./PartnerSponsorDialog";

interface HeroSectionProps {
  headline: string;
  subheadline?: string;
  ctaLabel: string;
  ctaUrl: string;
}

export const HeroSection = ({ headline, subheadline, ctaLabel, ctaUrl }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-primary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Society of Black Academics"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-primary/80"></div>
      </div>
      
      {/* Content Grid */}
      <div className="relative z-10 container-wide w-full pt-28 pb-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left - Circular Image */}
          <div className="relative order-2 lg:order-1 hidden lg:flex justify-start max-w-full overflow-visible">
            <div className="relative max-w-[min(22rem,calc(100vw-3rem))] lg:max-w-none">
              {/* Decorative circle behind */}
              <div className="absolute -top-5 -right-5 md:-top-8 md:-right-8 w-full aspect-square rounded-full bg-accent/20 blur-sm"></div>
              
              {/* Main circular image */}
              <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 max-w-full rounded-full overflow-hidden border-4 border-primary-foreground/20 shadow-2xl">
                <img 
                  src={heroImage} 
                  alt="Black Academics Community"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </div>
          
          {/* Right - Content */}
          <div className="order-1 lg:order-2 text-primary-foreground max-w-3xl lg:max-w-none">
            {/* Tagline */}
            <p className="text-accent font-medium text-lg mb-4 animate-fade-in">
              Empowering Black Academics
            </p>
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6 animate-fade-in stagger-1 break-words">
              Driving Inclusive Change In Higher Education.
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl mb-10 leading-relaxed animate-fade-in stagger-2">
              {subheadline || "Join a community of scholars, researchers, and educators committed to advancing diversity and excellence in academia."}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in stagger-3 max-w-full">
              <Button 
                asChild 
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 py-6 text-lg font-medium transition-all duration-300 hover:scale-105"
              >
                <a href="/join-us">
                  Join the Network
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <PartnerSponsorDialog>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary rounded-full px-8 py-6 text-lg font-medium transition-all duration-300"
                >
                  <Handshake className="mr-2 h-5 w-5" />
                  Partner With Us
                </Button>
              </PartnerSponsorDialog>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
