import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import sbaImage from "@/assets/images/gallery/sba5.jpeg";
import sbaImage2 from "@/assets/images/gallery/sba6.jpeg";

interface Community {
  id: string;
  name: string;
  description: string;
  link: string;
}

export const CommunitiesSection = () => {
  const communities: Community[] = [
    {
      id: '1',
      name: 'Early Career Academics',
      description: 'Support network for PhD students and early career researchers navigating their academic journey.',
      link: '/resources'
    },
    {
      id: '2',
      name: 'Senior Academics',
      description: 'A community for established academics in leadership and senior research positions.',
      link: '/resources'
    },
    {
      id: '3',
      name: 'Aspiring Scholars',
      description: 'Resources and mentorship for students considering an academic career path.',
      link: '/resources'
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-0 items-stretch">
          {/* Left - Images Grid */}
          <div className="relative min-h-[300px] lg:min-h-[700px] order-2 lg:order-1 bg-muted flex items-center justify-center">
            <img 
              src={sbaImage}
              alt="SBA Community"
              className="w-full h-full object-contain"
            />
          </div>
          {/* Right - Content */}
          <div className="bg-muted/30 p-8 lg:p-16 flex flex-col justify-center order-1 lg:order-2">
            <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Our communities
            </h4>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              We understand the need for nuance and specificity, which is why we have created several communities that you can join. Each with its unique landscape, language, and content, we hope that you find one that works for you.
            </p>
            
            {/* Community Cards */}
            <div className="space-y-6 mb-8">
              {communities.map((community) => (
                <div 
                  key={community.id}
                  className="border-l-4 border-accent pl-6 py-2"
                >
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {community.name}
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    {community.description}
                  </p>
                  <Button 
                    asChild 
                    variant="link" 
                    className="p-0 h-auto text-primary hover:text-accent"
                  >
                    <a href={community.link}>
                      Learn more
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
