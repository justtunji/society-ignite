import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import sbaImage from "@/assets/images/gallery/sba-event-6.jpeg";

export const AboutSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Text Content */}
          <div className="order-2 lg:order-1">
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              The Society of Black Academics (SBA) is an organisation committed to the empowerment of Black academics through the provision of access to opportunities for career advancement, research excellence, and leadership development.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              We bring together scholars, researchers, educators, and aspiring academics to address challenges, share insights, and support the development of Black communities in higher education.
            </p>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="rounded-full px-8 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <a href="/about">
                Learn more
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
          
          {/* Right - Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img 
                src={sbaImage}
                alt="SBA Community"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
