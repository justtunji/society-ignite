import { useEffect } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Video, Link as LinkIcon, Download } from "lucide-react";

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
        {
          title: "Academic Job Application Guide",
          type: "PDF",
          description: "Comprehensive guide to writing successful academic job applications, including CV tips and cover letter templates.",
          icon: FileText,
          topics: ["Career", "Applications", "CV Writing"]
        },
        {
          title: "Networking Strategies for Academics",
          type: "Video",
          description: "Learn effective networking techniques to build meaningful professional relationships in academia.",
          icon: Video,
          topics: ["Networking", "Professional Development"]
        },
        {
          title: "Promotion and Progression Toolkit",
          type: "PDF",
          description: "Essential resources for understanding academic promotion processes and preparing successful applications.",
          icon: FileText,
          topics: ["Promotion", "Career Progression"]
        }
      ]
    },
    {
      title: "Research & Publications",
      description: "Research insights and publication opportunities",
      resources: [
        {
          title: "Diversity in Higher Education Report 2024",
          type: "PDF",
          description: "Annual report on diversity statistics and trends in UK higher education institutions.",
          icon: FileText,
          topics: ["Research", "Diversity", "Statistics"]
        },
        {
          title: "Publication Strategy for Early Career Researchers",
          type: "Guide",
          description: "Strategic guidance on building a strong publication record as an early career academic.",
          icon: LinkIcon,
          topics: ["Publications", "Early Career", "Research"]
        },
        {
          title: "Conference Presentation Skills",
          type: "Video",
          description: "Expert tips on delivering impactful presentations at academic conferences.",
          icon: Video,
          topics: ["Presentations", "Conferences", "Skills"]
        }
      ]
    },
    {
      title: "Mentorship & Support",
      description: "Mentoring resources and community support materials",
      resources: [
        {
          title: "Mentorship Program Guidelines",
          type: "PDF",
          description: "Framework for establishing effective mentoring relationships in academic settings.",
          icon: FileText,
          topics: ["Mentorship", "Guidelines", "Support"]
        },
        {
          title: "Wellbeing in Academia Workshop",
          type: "Video",
          description: "Addressing mental health and wellbeing challenges faced by academics, with practical strategies.",
          icon: Video,
          topics: ["Wellbeing", "Mental Health", "Support"]
        },
        {
          title: "Building Inclusive Academic Environments",
          type: "Guide",
          description: "Best practices for creating and maintaining inclusive academic spaces.",
          icon: LinkIcon,
          topics: ["Inclusion", "Environment", "Best Practices"]
        }
      ]
    }
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case "PDF":
        return "text-red-500";
      case "Video":
        return "text-blue-500";
      case "Guide":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen">
      <Header logoUrl="/lovable-uploads/logo@2x.png" siteName="Society of Black Academics" />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-b from-background to-muted/20">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="heading-xl mb-6">Resources</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Access our curated collection of resources designed to support Black academics at every stage of their career journey.
              </p>
            </div>
          </div>
        </section>

        {/* Resource Categories */}
        <section className="section-padding">
          <div className="container-wide">
            {resourceCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-16">
                <div className="mb-8">
                  <h2 className="heading-lg mb-3">{category.title}</h2>
                  <p className="text-lg text-muted-foreground">{category.description}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.resources.map((resource, resourceIndex) => (
                    <Card key={resourceIndex} className="h-full hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <resource.icon className={`h-6 w-6 mt-1 ${getIconColor(resource.type)}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold line-clamp-2">{resource.title}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {resource.type}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                              {resource.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-4">
                              {resource.topics.map((topic, topicIndex) => (
                                <Badge key={topicIndex} variant="outline" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                            <button className="inline-flex items-center text-primary hover:underline text-sm">
                              <Download className="h-4 w-4 mr-1" />
                              Access Resource
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resource Request Section */}
        <section className="section-padding bg-muted/20">
          <div className="container-wide">
            <div className="text-center">
              <h2 className="heading-lg mb-6">Need Something Specific?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Can't find the resource you're looking for? Let us know what would be helpful for your academic journey.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
              >
                Request a Resource
              </a>
            </div>
          </div>
        </section>

        {/* Community Resources */}
        <section className="section-padding">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="heading-lg mb-6">Community Resources</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Connect with our community and access additional support through our various platforms and partnerships.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center p-6">
                <CardContent className="p-0">
                  <h3 className="font-semibold mb-2">LinkedIn Network</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Join our professional network for daily updates and opportunities.
                  </p>
                  <a 
                    href="https://www.linkedin.com/company/society-of-black-academics/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    Connect on LinkedIn
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="p-0">
                  <h3 className="font-semibold mb-2">Newsletter</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Stay updated with the latest news, events, and opportunities.
                  </p>
                  <a 
                    href="/join-us"
                    className="text-primary hover:underline text-sm"
                  >
                    Subscribe Now
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="p-0">
                  <h3 className="font-semibold mb-2">Mentorship Program</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Connect with mentors and build meaningful professional relationships.
                  </p>
                  <a 
                    href="/contact"
                    className="text-primary hover:underline text-sm"
                  >
                    Learn More
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="p-0">
                  <h3 className="font-semibold mb-2">Events & Workshops</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Attend our regular events for networking and professional development.
                  </p>
                  <a 
                    href="/gallery"
                    className="text-primary hover:underline text-sm"
                  >
                    View Past Events
                  </a>
                </CardContent>
              </Card>
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