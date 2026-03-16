import { useEffect } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, FileText, Video, Link as LinkIcon, ArrowRight, Briefcase, GraduationCap, Users } from "lucide-react";
import resourcesHero from "@/assets/images/resources-hero.jpg";
import sbaLogo from "@/assets/logos/sba-logo.png";
import SBAUpdateMarch2026 from "@/components/SBAUpdateMarch2026";


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
      icon: Briefcase,
      gradient: "from-accent/20 to-accent/5",
      borderColor: "border-accent",
      iconBg: "bg-accent/10 text-accent",
      resources: [
        { title: "Academic Job Application Guide", type: "PDF", description: "Comprehensive guide to writing successful academic job applications.", icon: FileText, topics: ["Career", "Applications"] },
        { title: "Networking Strategies for Academics", type: "Video", description: "Learn effective networking techniques in academia.", icon: Video, topics: ["Networking", "Development"] },
        { title: "Promotion and Progression Toolkit", type: "PDF", description: "Essential resources for understanding promotion processes.", icon: FileText, topics: ["Promotion", "Career"] }
      ]
    },
    {
      title: "Research & Publications",
      description: "Research insights and publication opportunities",
      icon: GraduationCap,
      gradient: "from-teal/20 to-teal/5",
      borderColor: "border-teal",
      iconBg: "bg-teal/10 text-teal",
      resources: [
        { title: "Diversity in Higher Education Report 2024", type: "PDF", description: "Annual report on diversity statistics in UK HE.", icon: FileText, topics: ["Research", "Diversity"] },
        { title: "Publication Strategy for ECRs", type: "Guide", description: "Building a strong publication record.", icon: LinkIcon, topics: ["Publications", "ECR"] },
        { title: "Conference Presentation Skills", type: "Video", description: "Delivering impactful presentations.", icon: Video, topics: ["Presentations", "Skills"] }
      ]
    },
    {
      title: "Mentorship & Support",
      description: "Mentoring resources and community support materials",
      icon: Users,
      gradient: "from-coral/20 to-coral/5",
      borderColor: "border-coral",
      iconBg: "bg-coral/10 text-coral",
      resources: [
        { title: "Mentorship Program Guidelines", type: "PDF", description: "Framework for effective mentoring relationships.", icon: FileText, topics: ["Mentorship", "Guidelines"] },
        { title: "Wellbeing in Academia Workshop", type: "Video", description: "Addressing mental health challenges.", icon: Video, topics: ["Wellbeing", "Support"] },
        { title: "Building Inclusive Environments", type: "Guide", description: "Best practices for inclusive spaces.", icon: LinkIcon, topics: ["Inclusion", "Environment"] }
      ]
    }
  ];

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case "PDF": return "bg-destructive/10 text-destructive border-destructive/20";
      case "Video": return "bg-indigo/10 text-indigo border-indigo/20";
      case "Guide": return "bg-emerald/10 text-emerald border-emerald/20";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen">
      <Header logoUrl={sbaLogo} siteName="Society of Black Academics" />
      
      <main>
        {/* Hero Section */}
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

        {/* SBA Updates */}
        <section className="py-20 lg:py-32 bg-gradient-to-b from-background via-muted/20 to-background">
          <div className="container-wide">
            <SBAUpdateMarch2026 />
          </div>
        </section>

        {/* Resource Categories */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container-wide">
            {resourceCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-20 last:mb-0">
                <div className={`mb-12 p-8 rounded-2xl bg-gradient-to-r ${category.gradient}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category.iconBg}`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-foreground">{category.title}</h2>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {category.resources.map((resource, resourceIndex) => (
                    <div key={resourceIndex} className={`bg-background p-8 border-l-4 ${category.borderColor} group hover:shadow-lg transition-all duration-300 rounded-r-lg`}>
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${category.iconBg}`}>
                          <resource.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold">{resource.title}</h3>
                          </div>
                          <Badge variant="outline" className={`text-xs mb-3 ${getTypeBadgeStyle(resource.type)}`}>
                            {resource.type}
                          </Badge>
                          <p className="text-muted-foreground text-sm mb-4">
                            {resource.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {resource.topics.map((topic, topicIndex) => (
                              <Badge key={topicIndex} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                          <button className={`inline-flex items-center text-sm font-medium transition-colors hover:opacity-80`} style={{ color: 'hsl(var(--accent))' }}>
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
              {[
                { title: "LinkedIn Network", desc: "Join our professional network for updates.", href: "https://www.linkedin.com/company/society-of-black-academics/", label: "Connect →", external: true, color: "border-indigo" },
                { title: "Newsletter", desc: "Stay updated with the latest news.", href: "/join-us", label: "Subscribe →", external: false, color: "border-accent" },
                { title: "Mentorship", desc: "Connect with experienced mentors.", href: "/contact", label: "Learn More →", external: false, color: "border-teal" },
                { title: "Events", desc: "Attend our networking events.", href: "/gallery", label: "View Past Events →", external: false, color: "border-coral" },
              ].map((item, idx) => (
                <div key={idx} className={`text-center p-8 bg-muted/30 border-l-4 ${item.color} hover:shadow-md transition-shadow`}>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{item.desc}</p>
                  <a 
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="text-accent hover:text-accent/80 text-sm font-medium"
                  >
                    {item.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer
        siteName="Society of Black Academics"
        contactEmail="info@societyofblackacademics.com"
        socialLinkedin="https://www.linkedin.com/company/society-of-black-academics/"
        socialX="https://x.com/SocietyBlackAca"
        socialInstagram="https://www.instagram.com/societyofblackacademics/"
        footerBlurb="Driving inclusive change in the Higher Education sector through community, networking, and professional development."
      />
    </div>
  );
};

export default Resources;
