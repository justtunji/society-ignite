import { useEffect } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, FileText, Video, Link as LinkIcon, ArrowRight, Briefcase, GraduationCap, Users, Newspaper } from "lucide-react";
import resourcesHero from "@/assets/images/resources-hero.jpg";
import sbaLogo from "@/assets/logos/sba-logo.png";
import SBAUpdatesSection from "@/components/SBAUpdatesSection";
import { useSectionContent } from '@/hooks/useSectionContent';

const HERO_DEFAULTS = {
  eyebrow: 'Knowledge Hub',
  headline: 'Resources for Success.',
  subheadline: 'Access our curated collection of resources designed to support Black academics at every stage of their career journey.',
  image_url: '', cta_label: '', cta_url: '',
};

const Resources = () => {
  const hero = useSectionContent('resources', 'hero', HERO_DEFAULTS);
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
      heading: "Reports",
      icon: FileText,
      color: "border-accent",
      iconBg: "bg-accent/10 text-accent",
      items: [
        { title: "Unblocking the Pipeline", description: "Supporting the Retention, Progression and Promotion of Black Early-Career Academics — published by Advance HE with GatenbySanderson and HEPI.", href: "https://www.gatenbysanderson.com/news/report-supporting-the-retention-progression-and-promotion-of-black-early-career-academics/", image: "/lovable-uploads/reports/unblocking-pipeline.png" },
        { title: "HEPI Report", description: "Our HEPI partnership report exploring the experiences and progression of Black academics in UK Higher Education.", href: "https://www.hepi.ac.uk/", image: "/lovable-uploads/reports/hepi-report.png" },
        { title: "Developing a successful career as a black academic in the UK", description: "Black academics remain underrepresented at professorial and leadership levels in UK universities.", href: "https://www.sbia.business-school.ed.ac.uk/news/developing-a-successful-career-as-a-black-academic-in-the-uk", image: "/lovable-uploads/reports/black-academic.jpeg" },
        { title: "Impactful Research and Scholarship", description: "A short piece on Impactful Research and Scholarship from our 2nd annual conference.", href: "https://www.linkedin.com/feed/update/urn:li:activity:6969935472240271360/", image: "/lovable-uploads/reports/impactful-research.png" },
      ],
    },
    {
      heading: "Conferences & News",
      icon: Newspaper,
      color: "border-coral",
      iconBg: "bg-coral/10 text-coral",
      items: [
        { title: "SBA Annual Conference 2024 — Bristol", description: "Over 70 Black academics from across the UK and US gathered for the SBA annual conference at the University of Bristol.", href: "https://www.bristol.ac.uk/news/2024/september/sba-conference-2024.html" },
        { title: "How to make universities more inclusive", description: "Mercy Denedo on support networks, mentoring and inter-institutional collaboration to improve representation. Times Higher Education.", href: "https://www.timeshighereducation.com/blog/how-make-universities-more-inclusive-black-academics" },
        { title: "1st Annual Conference (June 2021)", description: "‘Developing a successful career as a Black Academic in the UK’ — University of Edinburgh Business School.", href: "https://www.business-school.ed.ac.uk/event/developing-a-successful-career-as-a-black-academic-in-the-uk" },
        { title: "2nd Annual Conference (July 2022)", description: "‘Impactful Research and Scholarship’ — Africa Research Group, University of Nottingham Business School.", href: "https://www.nottingham.ac.uk/business/who-we-are/centres-and-institutes/arg/newsevents.aspx" },
      ],
    },
    {
      heading: "Past Workshops",
      icon: Users,
      color: "border-teal",
      iconBg: "bg-teal/10 text-teal",
      items: [
        { title: "Breaking Glass Ceilings (Nov 2022)", description: "3rd SBA Global Workshop — Mentorship and collaborations for academic success, hosted by King's Business School, KCL.", href: "https://www.eventbrite.co.uk/e/breaking-glass-ceilings-mentorship-and-collaborations-for-academic-success-tickets-427035844707" },
        { title: "Logistics, Transport & Supply Chain Careers (June 2022)", description: "Workshop on Developing a Career in Logistics, Transport, and Supply Chain Management.", href: "https://www.instagram.com/p/Cdvx02EsRQU/" },
        { title: "Building Resilience (March 2022)", description: "2nd SBA Global Workshop — Building Resilience and Strength through your Academic Career, University of Leicester.", href: "https://www.instagram.com/p/Cam7BzMMEzG/" },
        { title: "Entering the Academic Market (Nov 2021)", description: "1st SBA Global Workshop for Early Career Researchers — Henley Business School, University of Reading.", href: "https://www.youtube.com/watch?v=3m2pFRVPqd8" },
      ],
    },
    {
      heading: "Video Resources",
      icon: Video,
      color: "border-indigo",
      iconBg: "bg-indigo/10 text-indigo",
      items: [
        { title: "Successful Career as a Black Academic — Day 1 (June 2021)", description: "Day 1 recording of the 1st annual conference at the University of Edinburgh.", href: "https://media.ed.ac.uk/media/Developing+a+successful+career+as+a+black+academic+in+the+UK+Day+1/1_vc3wsa6y" },
        { title: "Successful Career as a Black Academic — Day 2 (June 2021)", description: "Day 2 recording of the 1st annual conference at the University of Edinburgh.", href: "https://media.ed.ac.uk/media/Developing+a+Successful+Career+as+a+Black+Academic+in+the+UK+-+3rd+June+2021/1_dhcj0gk5" },
        { title: "Breaking Glass Ceilings (Nov 2022)", description: "Recording of the 3rd Global Workshop hosted by King's Business School.", href: "https://emckclac-my.sharepoint.com/:v:/r/personal/k1818357_kcl_ac_uk/Documents/Recordings/3rd%20Global%20Workshop%20of%20Society%20of%20Black%20Academics-20221104_151329-Meeting%20Recording.mp4" },
        { title: "SBA YouTube Channel", description: "Watch recordings of our conferences, workshops, panels, and conversations with leading Black academics.", href: "https://www.youtube.com/@societyofblackacademics" },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Header logoUrl={sbaLogo} siteName="Society of Black Academics" />
      
      <main>
        {/* Hero Section */}
        {hero && (
          <section className="relative min-h-[80vh] flex items-center bg-primary">
            <div className="absolute inset-0">
              <img
                src={hero.image_url || resourcesHero}
                alt="Academic Resources and Learning"
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-primary/80"></div>
            </div>

            <div className="relative z-10 container-wide py-32">
              <div className="max-w-3xl">
                <p className="text-accent font-medium text-lg mb-4">{hero.eyebrow}</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary-foreground mb-6">
                  {hero.headline}
                </h1>
                <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed">
                  {hero.subheadline}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* SBA Updates */}
        <SBAUpdatesSection />

        {/* Key Resources - Categorized */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container-wide">
            <div className="text-center mb-16">
              <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Featured</h4>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">Key Resources</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Reports, news, workshops and recordings from across our community.
              </p>
            </div>

            <div className="space-y-20 max-w-7xl mx-auto">
              {resourceCategories.map((category, cIdx) => (
                <div key={cIdx}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.iconBg}`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-foreground">{category.heading}</h3>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {category.items.map((item: any, iIdx) => (
                      <a
                        key={iIdx}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`bg-background border-l-4 ${category.color} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-r-lg group flex flex-col h-full overflow-hidden`}
                      >
                        {item.image && (
                          <div className="aspect-[4/3] overflow-hidden bg-muted">
                            <img
                              src={item.image}
                              alt={item.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-6 flex flex-col flex-1">
                          <h4 className="font-bold text-lg mb-3 leading-snug">{item.title}</h4>
                          <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-1">{item.description}</p>
                          <span className="inline-flex items-center text-sm font-medium text-accent group-hover:translate-x-1 transition-transform">
                            Read More
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
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
