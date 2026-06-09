import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import sbaImage from "@/assets/images/gallery/sba-event-6.jpeg";
import { useSectionContent } from "@/hooks/useSectionContent";

const DEFAULTS = {
  eyebrow: '',
  paragraph_1: 'The Society of Black Academics (SBA) is an organisation committed to the empowerment of Black academics through the provision of access to opportunities for career advancement, research excellence, and leadership development.',
  paragraph_2: 'We bring together scholars, researchers, educators, and aspiring academics to address challenges, share insights, and support the development of Black communities in higher education.',
  cta_label: 'Learn more',
  cta_url: '/about',
  image_url: '',
};

export const AboutSection = () => {
  const c = useSectionContent('home', 'about_intro', DEFAULTS);
  if (!c) return null;

  return (
    <section data-section="about_intro" className="py-20 lg:py-32 bg-background">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            {c.eyebrow && (
              <p
                data-style-id="about-intro-eyebrow"
                className="eyebrow text-accent font-semibold uppercase tracking-wider mb-4"
              >
                {c.eyebrow}
              </p>
            )}
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">{c.paragraph_1}</p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">{c.paragraph_2}</p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <a href={c.cta_url || '/about'}>
                {c.cta_label || 'Learn more'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative">
              <img
                src={c.image_url || sbaImage}
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
