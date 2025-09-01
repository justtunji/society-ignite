import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

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
      <div className="relative z-10 hero-content animate-fade-in text-center lg:text-left lg:max-w-4xl lg:mx-0 lg:ml-6">
        <h1 className="hero-title">
          {headline}
        </h1>
        {subheadline && (
          <p className="hero-subtitle max-w-2xl mx-auto lg:mx-0">
            {subheadline}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mt-8">
          <Button 
            asChild 
            size="lg"
            className="group bg-white text-black hover:bg-white/90"
          >
            <a href={ctaUrl}>
              {ctaLabel}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
          <Button 
            asChild 
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-primary"
          >
            <a href="/about">
              Learn More
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};