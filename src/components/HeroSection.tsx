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
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Society of Black Academics"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/80"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 hero-content text-center lg:text-left container-wide">
        <div className="animate-slide-up">
          <h1 className="hero-title">
            {headline.split('\n').map((line, index) => (
              <span key={index} className={`inline-block animate-fade-in stagger-${index + 1}`}>
                {line === "Driving Inclusive Change In" && <br />}
                {index}
              </span>
            ))}
          </h1>
        </div>
        <div className="animate-slide-up stagger-2">
          <p className="hero-subtitle max-w-2xl mx-auto lg:mx-0">
            The Society of Black Academics (SBA) provides a supportive community where Black Academics and Aspiring Scholars connect, share insights, and strengthen their career paths.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mt-8 animate-slide-up stagger-3">
          <Button 
            asChild 
            size="lg"
            className="group bg-white text-black hover:bg-white/90 hover-lift animate-bounce-gentle"
          >
            <a href="/join-us">
              Become a Member
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
          <PartnerSponsorDialog>
            <Button 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-primary group hover-lift"
            >
              <Handshake className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Become a Partner & Sponsor
            </Button>
          </PartnerSponsorDialog>
        </div>
      </div>
    </section>
  );
};
