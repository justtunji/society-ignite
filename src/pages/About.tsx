import { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Handshake, ArrowRight } from "lucide-react";
import { PartnerSponsorDialog } from "@/components/PartnerSponsorDialog";
import { supabase } from '@/integrations/supabase/client';
import aboutHero from "@/assets/images/about-hero.jpg";
import sbaLogo from "@/assets/logos/sba-logo.png";

interface TeamMember {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  image_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  is_featured: boolean | null;
  order_index: number | null;
}

const About = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [advisoryMembers, setAdvisoryMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    document.title = "About Us | Society of Black Academics";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about the Society of Black Academics (SBA), our mission to promote Justice, Equity, and Fairness for Black academics in UK Higher Education.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Learn about the Society of Black Academics (SBA), our mission to promote Justice, Equity, and Fairness for Black academics in UK Higher Education.';
      document.head.appendChild(meta);
    }

    const fetchTeamMembers = async () => {
      const { data } = await supabase
        .from('team_members_public')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (data) {
        // Split: featured members go to advisory board, non-featured to team
        setTeamMembers(data.filter(m => !m.is_featured));
        setAdvisoryMembers(data.filter(m => m.is_featured));
      }
    };
    fetchTeamMembers();
  }, []);

  return (
    <div className="min-h-screen">
      <Header logoUrl={sbaLogo} siteName="Society of Black Academics" />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center bg-primary">
          <div className="absolute inset-0">
            <img 
              src={aboutHero} 
              alt="About Society of Black Academics"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-primary/80"></div>
          </div>
          
          <div className="relative z-10 container-wide py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-primary-foreground">
                <p className="text-accent font-medium text-lg mb-4">About Us</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Driving Change in Higher Education.
                </h1>
                <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed">
                  The Society of Black Academics (SBA) was formed due to the under-representation of Black academics at the Professorial and Senior Leadership levels in UK Universities.
                </p>
              </div>
              
              <div className="hidden lg:flex justify-center items-center">
                <div className="relative w-80 h-80 mx-auto flex items-center justify-center bg-white rounded-2xl shadow-lg">
                  <img 
                    src={sbaLogo}
                    alt="Society of Black Academics Logo"
                    className="relative w-full h-full object-contain p-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why SBA Section */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-0 items-stretch">
              <div className="p-8 lg:p-16 flex flex-col justify-center">
                <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Why SBA</h4>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Since our inception in 2021, we have launched several impactful initiatives and organized numerous events (including Workshops and Conferences) with the goal of promoting Equality, Diversity, and Inclusion (EDI) in the UK's Higher Education sector.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  Through the development of EDI and career development programmes, safe spaces for learning and knowledge exchange, as well as other progressive campaigns, we are attempting to improve the career advancement of Black academics.
                </p>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="w-fit rounded-full px-8"
                >
                  <a href="/resources">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="relative min-h-[400px] flex items-center justify-center bg-muted/20 p-8">
                <img 
                  src={sbaLogo}
                  alt="Society of Black Academics Logo"
                  className="max-w-full max-h-[350px] object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-20 lg:py-32 bg-muted/30">
          <div className="container-wide">
            <div className="text-center mb-16">
              <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Our Foundation</h4>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                Mission, Vision & Values
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-8 lg:p-12 border-l-4 border-accent">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We continue to identify prevalent issues confronting Black academics in the Higher Education sector and address them by providing a safe space for personal reflection, knowledge sharing and dialogue, collaboration, and networking.
                </p>
              </div>

              <div className="bg-background p-8 lg:p-12 border-l-4 border-accent">
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Justice, Equity, and Fairness (JEF) are at the heart of SBA's values. We aim to see a better level of JEF embedded in the progression opportunities for Black scholars in the UK's Higher Education sector.
                </p>
              </div>

              <div className="bg-background p-8 lg:p-12 border-l-4 border-accent">
                <h3 className="text-2xl font-bold mb-4">Our Values</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We pride ourselves in promoting Justice (broader ethical standards), Equity (encouraging equal opportunities and inclusivity), and Fairness (focusing on specific outcomes and treatment).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SBA Logo Display */}
        <section className="py-16 bg-background">
          <div className="container-wide flex justify-center">
            <img 
              src={sbaLogo}
              alt="Society of Black Academics Logo"
              className="h-32 md:h-44 w-auto object-contain"
            />
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 lg:py-32 bg-background" id="our_team">
          <div className="container-wide">
            <div className="text-center mb-16">
              <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Our Team</h4>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Meet Our Team
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our team is made up of academics and practitioners from various fields who are enthusiastic about advancing the progression of Black academics.
              </p>
            </div>

            {teamMembers.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member) => (
                  <div key={member.id} className="group">
                    <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-muted">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No photo
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    {member.title && <p className="text-accent font-medium mb-3">{member.title}</p>}
                    {member.bio && <p className="text-muted-foreground text-sm leading-relaxed mb-3">{member.bio}</p>}
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-accent transition-colors text-sm font-medium"
                      >
                        LinkedIn →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Team members coming soon.</p>
            )}
          </div>
        </section>

        {/* Advisory Board Section */}
        {advisoryMembers.length > 0 && (
          <section className="py-20 lg:py-32 bg-muted/30" id="advisory_board">
            <div className="container-wide">
              <div className="text-center mb-16">
                <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Leadership</h4>
                <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  Advisory Board
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Our distinguished advisory board provides strategic guidance and expertise to advance SBA's mission.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {advisoryMembers.map((member) => (
                  <div key={member.id} className="group">
                    <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-muted">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No photo
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    {member.title && <p className="text-accent font-medium text-sm mb-1">{member.title}</p>}
                    {member.bio && <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Partners CTA */}
        <section className="py-20 lg:py-32 bg-primary text-primary-foreground" id="part_spon">
          <div className="container-wide text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Become Our Partner
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-3xl mx-auto">
              Ready to team up with us? Let's create impact together and explore exciting sponsorship and partnership possibilities.
            </p>
            <PartnerSponsorDialog>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 py-6 text-lg">
                <Handshake className="mr-2 h-5 w-5" />
                Become a Partner / Sponsor
              </Button>
            </PartnerSponsorDialog>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
