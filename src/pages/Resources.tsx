import { useEffect } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, FileText, Video, Link as LinkIcon, ArrowRight, Briefcase, GraduationCap, Users } from "lucide-react";
import resourcesHero from "@/assets/images/resources-hero.jpg";
import sbaLogo from "@/assets/logos/sba-logo.png";
import SBAUpdatesSection from "@/components/SBAUpdatesSection";


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

  const featuredResources = [
    {
      title: "HEPI Report",
      description: "Our partnership report with HEPI exploring the experiences and progression of Black academics in UK Higher Education.",
      type: "PDF",
      icon: FileText,
      href: "https://www.hepi.ac.uk/",
      cta: "View Report",
      color: "border-accent",
      iconBg: "bg-accent/10 text-accent",
      gradient: "from-accent/20 to-accent/5",
    },
    {
      title: "SBA YouTube Channel",
      description: "Watch recordings of our conferences, workshops, panels, and conversations with leading Black academics.",
      type: "Video",
      icon: Video,
      href: "https://www.youtube.com/@societyofblackacademics",
      cta: "Watch Now",
      color: "border-coral",
      iconBg: "bg-coral/10 text-coral",
      gradient: "from-coral/20 to-coral/5",
    },
    {
      title: "University of Edinburgh",
      description: "Resources and research from our partnership with the University of Edinburgh on advancing Black academic leadership.",
      type: "Link",
      icon: LinkIcon,
      href: "https://www.ed.ac.uk/",
      cta: "Visit Resource",
      color: "border-teal",
      iconBg: "bg-teal/10 text-teal",
      gradient: "from-teal/20 to-teal/5",
    },
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
        <SBAUpdatesSection />

        {/* Featured Resources */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container-wide">
            <div className="text-center mb-16">
              <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Featured</h4>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">Key Resources</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featuredResources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-background p-8 border-l-4 ${resource.color} hover:shadow-lg transition-all duration-300 rounded-r-lg group`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${resource.iconBg}`}>
                    <resource.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className={`text-xs mb-3 ${getTypeBadgeStyle(resource.type)}`}>
                    {resource.type}
                  </Badge>
                  <h3 className="font-bold text-xl mb-3">{resource.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{resource.description}</p>
                  <span className="inline-flex items-center text-sm font-medium text-accent group-hover:translate-x-1 transition-transform">
                    {resource.cta}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </span>
                </a>
              ))}
            </div>
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
