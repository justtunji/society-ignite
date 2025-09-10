import { useEffect } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

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
      image: "https://societyofblackacademics.com/wp-content/uploads/2023/06/Dr-Ade-Oyedijo-e1687520059154.jpeg",
      linkedin: "https://www.linkedin.com/in/ade-oyedijo-25986260/?originalSubdomain=uk"
    },
    {
      name: "Dr. Mercy Denedo",
      title: "Project Manager",
      bio: "Dr. Denedo is an Assistant Professor in Accounting at Durham University. She manages all SBA's projects and she also assists in the planning of SBA's annual conferences.",
      image: "https://societyofblackacademics.com/wp-content/uploads/2023/06/Dr-Mercy-Denedo.jpg",
      linkedin: "https://www.linkedin.com/in/mercy-denedo-68071135/?originalSubdomain=uk"
    },
    {
      name: "Dr. Bola Babajide",
      title: "Partnerships & External Engagement Manager",
      bio: "Dr. Babajide is a Senior Lecturer in Accounting and Finance at De Montfort University. She is responsible for SBA's partnerships and external engagement activities.",
      image: "https://societyofblackacademics.com/wp-content/uploads/2023/06/Dr-Bola-Babajide.jpg",
      linkedin: "https://www.linkedin.com/in/bola-o-babajide-64124352/?originalSubdomain=uk"
    },
    {
      name: "Steven Iorfa",
      title: "Operations & Events Manager",
      bio: "Steven looks after SBA's events and coordinates its operational activities. He is a doctoral researcher at the University of Portsmouth, looking at sustainability transitions in food systems.",
      image: "https://societyofblackacademics.com/wp-content/uploads/2023/09/Steven-Iorfa-e1693896382495.jpeg",
      linkedin: "https://www.linkedin.com/in/steven-kator-iorfa-138641116/"
    },
    {
      name: "Juliet Ocheja",
      title: "Company Secretary",
      bio: "Juliet is a qualified lawyer with extensive experience in a variety of fields, including the public sector, oil and gas, finance, and energy. She assists SBA and offers guidance on compliance and regulatory matters.",
      image: "https://societyofblackacademics.com/wp-content/uploads/2023/06/Juliet-Ocheja.jpeg",
      linkedin: "https://www.linkedin.com/in/juliet-ocheja-66952362/?originalSubdomain=uk"
    },
    {
      name: "Oyebola Toyese",
      title: "Marketing Manager",
      bio: "Oyebola Toyese is a specialist and consultant in branding, marketing, communications, and business growth. She provides support on SBA's marketing and branding approach.",
      image: "https://societyofblackacademics.com/wp-content/uploads/2023/06/Formal-2.jpeg",
      linkedin: "https://www.linkedin.com/in/oyebolatoyese/?originalSubdomain=uk"
    },
    {
      name: "Dr Opeoluwa Aiyenitaju",
      title: "Education Manager",
      bio: "Dr. Ope is an enthusiastic academic. She lectures in Business Information Systems at Manchester Metropolitan University. Additionally, she takes an integral role in SBA's student outreach initiative and holds the role of Education & Engagement Manager.",
      image: "https://societyofblackacademics.com/wp-content/uploads/2023/08/Dr-Opeoluwa-Aiyenitaju-.jpeg"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header logoUrl="/lovable-uploads/logo@2x.png" siteName="Society of Black Academics" />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-b from-background to-muted/20">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="heading-xl mb-6">About Us</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                The Society of Black Academics (SBA) was formed due to the under-representation of Black academics at the Professorial and Senior Leadership levels in UK Universities.
              </p>
            </div>
          </div>
        </section>

        {/* Why SBA Section */}
        <section className="section-padding">
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
                  src="https://societyofblackacademics.com/wp-content/uploads/2023/08/sba-contacto-1024x512.jpg"
                  alt="Society of Black Academics team meeting"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="section-padding bg-muted/20">
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
        <section className="section-padding" id="our_team">
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

        {/* Partners & Sponsors Section */}
        <section className="section-padding bg-muted/20" id="part_spon">
          <div className="container-wide">
            <div className="text-center">
              <h2 className="heading-lg mb-6">Become Our Partners & Sponsors</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Ready to team up with us? Let's create impact together and explore exciting sponsorship and partnership possibilities.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
              >
                Get in Touch
              </a>
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