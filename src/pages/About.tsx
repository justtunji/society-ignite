import { useEffect } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Handshake } from "lucide-react";
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
      image: drMercyDenedo,
      linkedin: "https://www.linkedin.com/in/mercy-denedo-68071135/?originalSubdomain=uk"
    },
    {
      name: "Dr. Bola Babajide",
      title: "Partnerships & External Engagement Manager",
      bio: "Dr. Babajide is a Senior Lecturer in Accounting and Finance at De Montfort University. She is responsible for SBA's partnerships and external engagement activities.",
      image: drBolaBabajide,
      linkedin: "https://www.linkedin.com/in/bola-o-babajide-64124352/?originalSubdomain=uk"
    },
    {
      name: "Steven Iorfa",
      title: "Operations & Events Manager",
      bio: "Steven looks after SBA's events and coordinates its operational activities. He is a doctoral researcher at the University of Portsmouth, looking at sustainability transitions in food systems.",
      image: stevenIorfa,
      linkedin: "https://www.linkedin.com/in/steven-kator-iorfa-138641116/"
    },
    {
      name: "Juliet Ocheja",
      title: "Company Secretary",
      bio: "Juliet is a qualified lawyer with extensive experience in a variety of fields, including the public sector, oil and gas, finance, and energy. She assists SBA and offers guidance on compliance and regulatory matters.",
      image: julietOcheja,
      linkedin: "https://www.linkedin.com/in/juliet-ocheja-66952362/?originalSubdomain=uk"
    },
    {
      name: "Oyebola Toyese",
      title: "Marketing Manager",
      bio: "Oyebola Toyese is a specialist and consultant in branding, marketing, communications, and business growth. She provides support on SBA's marketing and branding approach.",
      image: formal2,
      linkedin: "https://www.linkedin.com/in/oyebolatoyese/?originalSubdomain=uk"
    },
    {
      name: "Dr Opeoluwa Aiyenitaju",
      title: "Education Manager",
      bio: "Dr. Ope is an enthusiastic academic. She lectures in Business Information Systems at Manchester Metropolitan University. Additionally, she takes an integral role in SBA's student outreach initiative and holds the role of Education & Engagement Manager.",
      image: drOpeoluwaAiyenitaju
    }
  ];

  return (
    <div className="min-h-screen">
      <Header logoUrl={sbaLogo} siteName="Society of Black Academics" />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img 
              src={aboutHero} 
              alt="About Society of Black Academics"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/80"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 text-center text-white container-wide animate-fade-in">
            <h1 className="hero-title mb-6">About Us</h1>
            <p className="hero-subtitle max-w-3xl mx-auto">
              The Society of Black Academics (SBA) was formed due to the under-representation of Black academics at the Professorial and Senior Leadership levels in UK Universities.
            </p>
          </div>
        </section>

        {/* Why SBA Section */}
        <section className="section-padding bg-gradient-to-br from-purple-50 via-background to-indigo-50">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="heading-lg mb-6">Why SBA</h2>
                <div className="space-y-6 text-lg">
                  <p>
                    Since our inception in 2021, we have launched several impactful initiatives and organized numerous events (including Workshops and Conferences) with the goal of promoting Equality, Diversity, and Inclusion (EDI) in the UK's Higher Education sector.
                  </p>
                  <p>
                    Through the development of EDI and career development programmes, safe spaces for learning and knowledge exchange, as well as other progressive campaigns, we are attempting to improve the career advancement of Black academics. Our goal is to increase the number of Black academics employed at the professorial and senior leadership levels in the UK's higher education system.
                  </p>
                </div>
              </div>
              <div>
                <img 
                  src={sbaContacto}
                  alt="Society of Black Academics team meeting"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="section-padding bg-gradient-to-br from-emerald-50 via-background to-teal-50">
          <div className="container-wide">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="h-full">
                <CardContent className="p-8">
                  <h3 className="heading-md mb-4 text-primary">Our Mission</h3>
                  <p className="text-muted-foreground">
                    We continue to identify prevalent issues confronting Black academics in the Higher Education sector and address them by providing a safe space for personal reflection, knowledge sharing and dialogue, collaboration, and networking, all of which will have a long-lasting positive impact on Black academics' career development and success.
                  </p>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardContent className="p-8">
                  <h3 className="heading-md mb-4 text-primary">Our Vision</h3>
                  <p className="text-muted-foreground">
                    Justice, Equity, and Fairness (JEF) are at the heart of SBA's values. Therefore, we aim to see a better level of JEF embedded in the progression opportunities for Black scholars in the UK's Higher Education sector.
                  </p>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardContent className="p-8">
                  <h3 className="heading-md mb-4 text-primary">Our Values</h3>
                  <p className="text-muted-foreground">
                    We pride ourselves in promoting Justice (broader ethical standards and procedures), Equity (encouraging equal opportunities, inclusivity, diversity, and respect), and well as Fairness (focusing on specific outcomes and treatment).
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section-padding bg-gradient-to-br from-coral-50 via-background to-indigo-50" id="our_team">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="heading-lg mb-4">Meet Our Team</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our team is made up of academics and practitioners from various fields who are enthusiastic about advancing the progression of Black academics and enhancing equality, diversity, and inclusion (EDI) in the UK's higher education sector.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      />
                      <h3 className="heading-sm mb-2">{member.name}</h3>
                      <p className="text-primary font-medium mb-3">{member.title}</p>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                    {member.linkedin && (
                      <div className="text-center">
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Advisory Board Section */}
        <section className="section-padding" id="advisory_board">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="heading-lg mb-4">Advisory Board</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our distinguished advisory board provides strategic guidance and expertise to advance SBA's mission of promoting equity and inclusion in higher education.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Professor Sally Everett",
                  title: "Vice Dean, Education, Deputy Dean (interim)",
                  institution: "King's Business School",
                  bio: "Professor Sally Everett is Vice Dean, Education, Deputy Dean (interim), and Professor of Business Education at King's Business School. She is also the academic lead for Inclusive Education at King's College London and a National Teaching Fellow (2017).",
                  image: "https://aheconferencedotcom1.files.wordpress.com/2022/03/sally-everett-small.jpg" // Keep external URL as fallback
                },
                {
                  name: "Professor Kevin Ibeh",
                  title: "Professor of Marketing and International Business",
                  institution: "Birkbeck, University of London",
                  bio: "Kevin Ibeh, PhD, FCIM, FRSA, is Professor of Marketing and International Business and Pro Vice Chancellor (International) at Birkbeck, University of London. He is considered a leading authority on emerging African Multinational Enterprises.",
                  image: professorKevinIbeh
                },
                {
                  name: "Professor (Associate) Gillian Stokes",
                  title: "Associate Professor of Inclusive Social Research",
                  institution: "UCL Social Research Institute",
                  bio: "Gillian is an Associate Professor of Inclusive Social Research at the UCL Social Research Institute, University College London (UCL). She is also a qualified herbal practitioner and medical ethnobotanist with experience coaching both staff and students.",
                  image: teamMember9
                }
              ].map((member, index) => (
                <Card key={index} className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fade-in rounded-3xl overflow-hidden border-2 border-transparent hover:border-primary/20" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl opacity-50"></div>
                        <img
                          src={member.image}
                          alt={member.name}
                          className="relative w-36 h-36 rounded-full mx-auto mb-6 object-cover shadow-2xl border-4 border-white dark:border-gray-800"
                        />
                      </div>
                      <h3 className="heading-sm mb-3 text-xl font-medium">{member.name}</h3>
                      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-3 mb-3">
                        <p className="text-primary font-medium text-sm">{member.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{member.institution}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partners & Sponsors Section */}
        <section className="section-padding bg-gradient-to-br from-indigo-50 via-background to-purple-50" id="part_spon">
          <div className="container-wide">
            <div className="text-center">
              <h2 className="heading-lg mb-6">Become Our Partners & Sponsors</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Ready to team up with us? Let's create impact together and explore exciting sponsorship and partnership possibilities.
              </p>
              <PartnerSponsorDialog>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Handshake className="mr-2 h-5 w-5" />
                  Get in Touch
                </Button>
              </PartnerSponsorDialog>
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

export default About;