import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import sbaImage1 from "@/assets/images/gallery/sba-event-3.jpeg";


export const ProgrammesSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-0 items-stretch">
          {/* Left - Images */}
          <div className="relative bg-primary min-h-[400px] lg:min-h-[600px]">
            <img 
              src={sbaImage1}
              alt="SBA Programme"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          
          {/* Right - Content */}
          <div className="bg-background p-8 lg:p-16 flex flex-col justify-center">
            <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Our programmes
            </h4>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              We support the career development and success of Black academics across the UK by empowering universities, corporations, and research institutions with the insights, recommendations and support to implement authentic and effective diversity initiatives.
            </p>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="w-fit rounded-full px-8 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <a href="/resources">
                Learn more
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
