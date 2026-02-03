import { useEffect } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, FileText, Video, Link as LinkIcon, ArrowRight } from "lucide-react";
import resourcesHero from "@/assets/images/resources-hero.jpg";
import sbaLogo from "@/assets/logos/sba-logo.png";

const Resources = () => {
  useEffect(() => {
    document.title = "Resources | Society of Black Academics";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Access valuable resources, research papers, career development materials, and educational content from the Society of Black Academics.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Access valuable resources, research papers, career development materials, and educational content from the Society of Black Academics.';
      document.head.appendChild(meta);
    }
  }, []);

  const resourceCategories = [
    {
      title: "Career Development",
      description: "Tools and guidance for advancing your academic career",
      resources: [
        { title: "Academic Job Application Guide", type: "PDF", description: "Comprehensive guide to writing successful academic job applications.", icon: FileText, topics: ["Career", "Applications"] },
        { title: "Networking Strategies for Academics", type: "Video", description: "Learn effective networking techniques in academia.", icon: Video, topics: ["Networking", "Development"] },
        { title: "Promotion and Progression Toolkit", type: "PDF", description: "Essential resources for understanding promotion processes.", icon: FileText, topics: ["Promotion", "Career"] }
      ]
    },
    {
      title: "Research & Publications",
      description: "Research insights and publication opportunities",
      resources: [
        { title: "Diversity in Higher Education Report 2024", type: "PDF", description: "Annual report on diversity statistics in UK HE.", icon: FileText, topics: ["Research", "Diversity"] },
        { title: "Publication Strategy for ECRs", type: "Guide", description: "Building a strong publication record.", icon: LinkIcon, topics: ["Publications", "ECR"] },
        { title: "Conference Presentation Skills", type: "Video", description: "Delivering impactful presentations.", icon: Video, topics: ["Presentations", "Skills"] }
      ]
    },
    {
      title: "Mentorship & Support",
      description: "Mentoring resources and community support materials",
      resources: [
        { title: "Mentorship Program Guidelines", type: "PDF", description: "Framework for effective mentoring relationships.", icon: FileText, topics: ["Mentorship", "Guidelines"] },
        { title: "Wellbeing in Academia Workshop", type: "Video", description: "Addressing mental health challenges.", icon: Video, topics: ["Wellbeing", "Support"] },
        { title: "Building Inclusive Environments", type: "Guide", description: "Best practices for inclusive spaces.", icon: LinkIcon, topics: ["Inclusion", "Environment"] }
      ]
    }
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case "PDF": return "text-red-500";
      case "Video": return "text-blue-500";
      case "Guide": return "text-green-500";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen">
      <Header logoUrl={sbaLogo} siteName="Society of Black Academics" />
      
      <main>
        {/* Hero Section - DINN Style */}
        <section className="relative min-h-[80vh] flex items-center bg-primary">
          <div className="absolute inset-0">
            <img 
              src={resourcesHero} 
              alt="Academic Resources and Learning"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-primary/80"></div>
          </div>
          
          <div className="relative z-10 container-wide py-32">
            <div className="max-w-3xl">
              <p className="text-accent font-medium text-lg mb-4">Knowledge Hub</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary-foreground mb-6">
                Resources for Success.
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed">
                Access our curated collection of resources designed to support Black academics at every stage of their career journey.
              </p>
            </div>
          </div>
        </section>

        {/* Resource Categories */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container-wide">
            {resourceCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-20 last:mb-0">
                <div className="mb-12">
                  <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">{category.title}</h4>
                  <p className="text-lg text-muted-foreground">{category.description}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {category.resources.map((resource, resourceIndex) => (
                    <div key={resourceIndex} className="bg-muted/30 p-8 border-l-4 border-accent group hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-4 mb-4">
                        <resource.icon className={`h-6 w-6 mt-1 ${getIconColor(resource.type)}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold">{resource.title}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {resource.type}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mb-4">
                            {resource.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {resource.topics.map((topic, topicIndex) => (
                              <Badge key={topicIndex} variant="outline" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                          <button className="inline-flex items-center text-accent hover:text-accent/80 text-sm font-medium transition-colors">
                            <Download className="h-4 w-4 mr-1" />
                            Access Resource
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resource Request CTA */}
        <section className="py-20 lg:py-32 bg-primary text-primary-foreground">
          <div className="container-wide text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Need Something Specific?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-3xl mx-auto">
              Can't find the resource you're looking for? Let us know what would be helpful for your academic journey.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 py-6 text-lg"
            >
              <a href="/contact">
                Request a Resource
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </section>

        {/* Community Resources */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container-wide">
            <div className="text-center mb-16">
              <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Community</h4>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                Connect With Us
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-8 bg-muted/30 border-l-4 border-accent">
                <h3 className="font-bold text-lg mb-2">LinkedIn Network</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Join our professional network for updates.
                </p>
                <a 
                  href="https://www.linkedin.com/company/society-of-black-academics/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 text-sm font-medium"
                >
                  Connect →
                </a>
              </div>

              <div className="text-center p-8 bg-muted/30 border-l-4 border-accent">
                <h3 className="font-bold text-lg mb-2">Newsletter</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Stay updated with the latest news.
                </p>
                <a 
                  href="/join-us"
                  className="text-accent hover:text-accent/80 text-sm font-medium"
                >
                  Subscribe →
                </a>
              </div>

              <div className="text-center p-8 bg-muted/30 border-l-4 border-accent">
                <h3 className="font-bold text-lg mb-2">Mentorship</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Connect with experienced mentors.
                </p>
                <a 
                  href="/contact"
                  className="text-accent hover:text-accent/80 text-sm font-medium"
                >
                  Learn More →
                </a>
              </div>

              <div className="text-center p-8 bg-muted/30 border-l-4 border-accent">
                <h3 className="font-bold text-lg mb-2">Events</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Attend our networking events.
                </p>
                <a 
                  href="/gallery"
                  className="text-accent hover:text-accent/80 text-sm font-medium"
                >
                  View Past Events →
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        siteName="Society of Black Academics"
        contactEmail="info@societyofblackacademics.com"
        socialLinkedin="https://www.linkedin.com/company/society-of-black-academics/"
        footerBlurb="Driving inclusive change in the Higher Education sector through community, networking, and professional development."
      />
    </div>
  );
};

export default Resources;
