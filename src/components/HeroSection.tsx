import { Button } from "@/components/ui/button";
import { ArrowRight, Handshake } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { PartnerSponsorDialog } from "./PartnerSponsorDialog";

interface HeroSectionProps {
  headline: string;
  subheadline?: string;
  ctaLabel: string;
  ctaUrl: string;
}

export const HeroSection = ({ headline, subheadline, ctaLabel, ctaUrl }: HeroSectionProps) => {
  return (
    <section className="min-h-screen flex items-center bg-accent/5">
      <div className="container-wide grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content - Text */}
        <div className="space-y-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
            {headline.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index === 0 && <br />}
              </span>
            ))}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
            The Society of Black Academics (SBA) provides a supportive community where Black Academics and Aspiring Scholars connect, share insights, and strengthen their career paths.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              asChild 
              size="lg"
              className="group bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <a href="/join-us">
                Join the Network
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <PartnerSponsorDialog>
              <Button 
                variant="outline"
                size="lg"
                className="group"
              >
                <Handshake className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Become a Partner
              </Button>
            </PartnerSponsorDialog>
          </div>
        </div>
        
        {/* Right Content - Image */}
        <div className="relative">
          <img 
            src={heroImage} 
            alt="Society of Black Academics community"
            className="w-full h-[500px] lg:h-[600px] object-cover rounded-lg shadow-large"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-lg"></div>
        </div>
      </div>
    </section>
  );
};
