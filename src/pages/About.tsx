import { useEffect } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Handshake, ArrowRight } from "lucide-react";
import { PartnerSponsorDialog } from "@/components/PartnerSponsorDialog";
import aboutHero from "@/assets/images/about-hero.jpg";
import sbaLogo from "@/assets/logos/sba-logo.png";
import sbaContacto from "@/assets/images/sba-contacto.jpg";
import drAdeOyedijo from "@/assets/images/team/dr-ade-oyedijo.jpeg";
import drMercyDenedo from "@/assets/images/team/dr-mercy-denedo.jpg";
import drBolaBabajide from "@/assets/images/team/dr-bola-babajide.jpg";
import stevenIorfa from "@/assets/images/team/steven-iorfa.jpeg";
import julietOcheja from "@/assets/images/team/juliet-ocheja.jpeg";
import formal2 from "@/assets/images/team/formal-2.jpeg";
import drOpeoluwaAiyenitaju from "@/assets/images/team/dr-opeoluwa-aiyenitaju.jpeg";
import professorKevinIbeh from "@/assets/images/team/professor-kevin-ibeh.jpeg";
import teamMember9 from "@/assets/images/team/team-member-9.jpeg";

const About = () => {
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
  }, []);

  const teamMembers = [
    {
      name: "Dr. Ade Oyedijo",
      title: "Founder & Director",
      bio: "Dr Oyedijo is a Scholar who is currently based at the University of Leicester School of Business where he lectures in Operations and Supply Chain Management. Ade founded SBA and overseas its current activities.",
      image: drAdeOyedijo,
      linkedin: "https://www.linkedin.com/in/ade-oyedijo-25986260/?originalSubdomain=uk"
    },
    {
      name: "Dr. Mercy Denedo",
      title: "Project Manager",
      bio: "Dr. Denedo is an Assistant Professor in Accounting at Durham University. She manages all SBA's projects and she also assists in the planning of SBA's annual conferences.",
      image: drMercyDenedo
    },
    {
      name: "Dr. Bola Babajide",
      title: "Partnerships & External Engagement Manager",
      bio: "Dr. Babajide is a Senior Lecturer in Accounting and Finance at De Montfort University. She is responsible for SBA's partnerships and external engagement activities.",
      image: drBolaBabajide
    },
    {
      name: "Steven Iorfa",
      title: "Operations & Events Manager",
      bio: "Steven looks after SBA's events and coordinates its operational activities. He is a doctoral researcher at the University of Portsmouth, looking at sustainability transitions in food systems.",
      image: stevenIorfa
    },
    {
      name: "Juliet Ocheja",
      title: "Company Secretary",
      bio: "Juliet is a qualified lawyer with extensive experience in a variety of fields, including the public sector, oil and gas, finance, and energy. She assists SBA and offers guidance on compliance and regulatory matters.",
      image: julietOcheja
    },
    {
      name: "Oyebola Toyese",
      title: "Marketing Manager",
      bio: "Oyebola Toyese is a specialist and consultant in branding, marketing, communications, and business growth. She provides support on SBA's marketing and branding approach.",
      image: formal2
    },
    {
      name: "Dr Opeoluwa Aiyenitaju",
      title: "Education Manager",
      bio: "Dr. Ope is an enthusiastic academic. She lectures in Business Information Systems at Manchester Metropolitan University. Additionally, she takes an integral role in SBA's student outreach initiative and holds the role of Education & Engagement Manager.",
      image: drOpeoluwaAiyenitaju
    }
  ];

  const advisoryBoardMembers = [
    {
      name: "Professor Sally Everett",
      title: "Vice Dean, Education, Deputy Dean (interim)",
      institution: "King's Business School",
      bio: "Professor Sally Everett is Vice Dean, Education, Deputy Dean (interim), and Professor of Business Education at King's Business School. She is a National Teaching Fellow and a Principal Fellow of the Higher Education Academy.",
      image: "https://aheconferencedotcom1.files.wordpress.com/2022/03/sally-everett-small.jpg"
    },
    {
      name: "Professor Kevin Ibeh",
      title: "Professor of Marketing and International Business",
      institution: "Birkbeck, University of London",
      bio: "Kevin Ibeh, PhD, FCIM, FRSA, is Professor of Marketing and International Business and Pro Vice Chancellor (International) at Birkbeck, University of London.",
      image: professorKevinIbeh
    },
    {
      name: "Professor (Associate) Gillian Stokes",
      title: "Associate Professor of Inclusive Social Research",
      institution: "UCL Social Research Institute",
      bio: "Gillian is an Associate Professor of Inclusive Social Research at the UCL Social Research Institute, University College London (UCL).",
      image: teamMember9
    },
    {
      name: "Professor Temidayo Akenroye",
      title: "Faculty Member",
      institution: "University of Missouri-St Louis",
      bio: "Professor Temidayo Akenroye is a Faculty Member at the University of Missouri-St Louis and a Senior Visiting Fellow at Lagos Business School, Nigeria. He holds a PhD in Supply Chain Management.",
      image: "https://societyofblackacademics.com/wp-content/uploads/2024/05/temidayo-akenroye.jpg"
    },
    {
      name: "Professor Nelarine Cornelius",
      title: "Professor of Organisation Studies",
      institution: "University of Bradford",
      bio: "Nelarine Cornelius is a Professor of Organisation Studies. Her research is in the areas of social justice, business in society and the evolution of management practices in emerging, fragile economies.",
      image: "https://societyofblackacademics.com/wp-content/uploads/2024/05/nelarine-cornelius.jpg"
    },
    {
      name: "Professor Kenneth Amaeshi",
      title: "Professor of Sustainable Finance and Governance",
      institution: "School of Transnational Governance",
      bio: "Kenneth Amaeshi is a Professor of Sustainable Finance and Governance. He is a leading scholar on sustainable business and finance in the global south.",
      image: "https://societyofblackacademics.com/wp-content/uploads/2024/05/kenneth-amaeshi.jpg"
    },
    {
      name: "Professor Gloria Agyemang",
      title: "Professor of Accounting",
      institution: "Royal Holloway, University of London",
      bio: "Gloria Agyemang is a Professor of Accounting at Royal Holloway, University of London. Her research interests include NGO Accountability and Performance Management issues.",
      image: "https://societyofblackacademics.com/wp-content/uploads/2024/05/gloria-agyemang.jpg"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header logoUrl={sbaLogo} siteName="Society of Black Academics" />
      
      <main>
        {/* Hero Section - DINN Style */}
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

        {/* Why SBA Section - Split Layout */}
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

        {/* Mission, Vision, Values - Card Grid */}
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-accent font-medium mb-3">{member.title}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">{member.bio}</p>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
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
          </div>
        </section>

        {/* Advisory Board Section */}
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {advisoryBoardMembers.map((member, index) => (
                <div key={index} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-muted">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-accent font-medium text-sm mb-1">{member.title}</p>
                  <p className="text-muted-foreground text-sm mb-3">{member.institution}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
                Get in Touch
              </Button>
            </PartnerSponsorDialog>
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

export default About;
