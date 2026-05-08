import { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Check, GraduationCap, Briefcase, Users, School, Handshake, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { subscribeToMailchimp } from "@/lib/mailchimp";
import { StripePaymentForm } from "@/components/StripePaymentForm";
import { PartnerSponsorDialog } from "@/components/PartnerSponsorDialog";
import { ResearchTracksSection } from "@/components/ResearchTracksSection";
import joinUsHero from "@/assets/images/gallery/sba-event-6.jpeg";
import sbaLogo from "@/assets/logos/sba-logo.png";
import membershipLevelsImage from "@/assets/images/gallery/sba-event-3.jpeg";

const JoinUs = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    institution: '',
    membership: '',
    researchTrack: ''
  });

  const researchTracks = [
    'Law and Legal Studies',
    'Business, Management, and Economics',
    'Social Sciences',
    'Arts, Humanities, and Cultural Studies',
    'Sciences, Technology, Engineering, and Mathematics (STEM)',
    'Health, Medicine, and Life Sciences',
    'Education and Pedagogy',
    'Interdisciplinary and Cross-Cutting Research'
  ];

  useEffect(() => {
    document.title = "Join Us | Society of Black Academics";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Become a member of the Society of Black Academics. Join our community of scholars, researchers, and educators driving inclusive change in higher education.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Become a member of the Society of Black Academics. Join our community of scholars, researchers, and educators driving inclusive change in higher education.';
      document.head.appendChild(meta);
    }
  }, []);

  const membershipLevels = [
    {
      title: "Academic and Scholar Membership",
      shortTitle: "ASM",
      icon: GraduationCap,
      description: "For scholars at all levels from early career researcher (ECR) stage to senior academics at the Associate and Full Professorial levels."
    },
    {
      title: "Executive Leader Membership",
      shortTitle: "ELM",
      icon: Briefcase,
      description: "For current directors, managers, and leaders within the Higher Education sector such as Deans, Directors, Pro-Vice Chancellors, and Vice Chancellors."
    },
    {
      title: "Industry Practitioner Membership",
      shortTitle: "IPM",
      icon: Users,
      description: "For non-academic professionals wanting to transition into academia or practitioners who regularly engage with the scholarly community."
    },
    {
      title: "Student Membership",
      shortTitle: "SM",
      icon: School,
      description: "For current postgraduate students enrolled in Masters (MSc, MPhil) or PhD programs."
    }
  ];

  const benefits = [
    "Exposure to best practices, guidance, information, and a growing professional community",
    "Commitment to driving change and promoting Justice, Equity, and Fairness (JEF)",
    "Improved career prospects and exposure to exciting opportunities",
    "Access to a diverse network of academics at different career stages"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      
      // Save to members table
      const { error } = await supabase
        .from('members')
        .insert([{
          name: fullName,
          email: formData.email,
          category: formData.membership,
          preferences: { jobTitle: formData.jobTitle, institution: formData.institution, researchTrack: formData.researchTrack }
        }]);

      if (error) throw error;

      // Subscribe to Mailchimp with membership tags (triggers welcome automation)
      await subscribeToMailchimp({
        email: formData.email,
        name: fullName,
        source: 'membership-application',
        tags: ['New Member', formData.membership, formData.researchTrack].filter(Boolean),
        merge_fields: {
          JOBTITLE: formData.jobTitle,
          INSTITUT: formData.institution,
          MEMLEVEL: formData.membership,
          TRACK: formData.researchTrack,
        },
      }).catch(err => console.warn('Mailchimp subscription failed (non-blocking):', err));

      toast({
        title: "Application submitted!",
        description: "Thank you for supporting SBA. Check your email for a welcome message — you'll get to attend our conference for free!",
      });

      setFormData({ firstName: '', lastName: '', email: '', jobTitle: '', institution: '', membership: '', researchTrack: '' });
    } catch (error) {
      console.error('Error submitting membership:', error);
      toast({
        title: "Error submitting application",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
              src={joinUsHero} 
              alt="Join Society of Black Academics"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-primary/80"></div>
          </div>
          
          <div className="relative z-10 container-wide py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-primary-foreground">
                <p className="text-accent font-medium text-lg mb-4">Join Our Community</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Become a Member.
                </h1>
                <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed">
                  Join our community of scholars, researchers, and educators committed to driving inclusive change in higher education.
                </p>
              </div>
              
              <div className="hidden lg:flex justify-center">
                <img 
                  src={membershipLevelsImage}
                  alt="SBA Membership Levels"
                  className="max-w-md rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Why Join</h4>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">
                  Benefits of SBA Membership
                </h2>
                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-accent" />
                      </div>
                      <p className="text-muted-foreground text-lg">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="lg:hidden flex justify-center">
                <img 
                  src={membershipLevelsImage}
                  alt="SBA Membership Levels"
                  className="max-w-sm rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Membership Levels */}
        <section className="py-20 lg:py-32 bg-muted/30">
          <div className="container-wide">
            <div className="text-center mb-16">
              <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Membership Levels</h4>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                Choose Your Path
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {membershipLevels.map((level, index) => (
                <div key={index} className="bg-background p-8 lg:p-12 border-l-4 border-accent">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <level.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{level.title}</h3>
                      <span className="text-accent font-medium text-sm">({level.shortTitle})</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{level.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Form */}
        <section className="py-20 lg:py-32 bg-background" id="b-a-m">
          <div className="container-wide">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Apply Now</h4>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Support Us
                </h2>
                <p className="text-lg text-muted-foreground">
                  Support us and you'll get to attend our conference for free.
                </p>
              </div>
              
              <div className="bg-muted/30 rounded-2xl p-8 lg:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="Enter your first name" className="rounded-full px-6 py-6" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="Enter your last name" className="rounded-full px-6 py-6" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="Enter your email address" className="rounded-full px-6 py-6" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title *</Label>
                    <Input id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} required placeholder="Enter your job title" className="rounded-full px-6 py-6" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution *</Label>
                    <Input id="institution" name="institution" value={formData.institution} onChange={handleInputChange} required placeholder="Enter your institution" className="rounded-full px-6 py-6" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="membership">Membership Level *</Label>
                    <Select value={formData.membership} onValueChange={(v) => handleSelectChange('membership', v)}>
                      <SelectTrigger className="rounded-full px-6 py-6 h-auto">
                        <SelectValue placeholder="Please choose an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Academic and Scholar Membership (ASM)">Academic and Scholar Membership (ASM)</SelectItem>
                        <SelectItem value="Executive Leader Membership (ELM)">Executive Leader Membership (ELM)</SelectItem>
                        <SelectItem value="Industry Practitioner Membership (IPM)">Industry Practitioner Membership (IPM)</SelectItem>
                        <SelectItem value="Student Membership (SM)">Student Membership (SM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="researchTrack">Research Track *</Label>
                    <Select value={formData.researchTrack} onValueChange={(v) => handleSelectChange('researchTrack', v)}>
                      <SelectTrigger className="rounded-full px-6 py-6 h-auto">
                        <SelectValue placeholder="Select your research track" />
                      </SelectTrigger>
                      <SelectContent>
                        {researchTracks.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full rounded-full px-8 py-6 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Side-by-side CTAs: Become a Member / Become a Partner */}
        <section className="py-20 lg:py-32 bg-primary text-primary-foreground" id="part_spon">
          <div className="container-wide">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-8 lg:p-10 text-center flex flex-col">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">Become a Member</h3>
                <p className="text-primary-foreground/80 mb-8 flex-1">
                  Join our community of scholars and support inclusive change in higher education.
                </p>
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8">
                  <a href="#b-a-m">
                    Apply Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>

              <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-8 lg:p-10 text-center flex flex-col">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">Become a Partner & Sponsor</h3>
                <p className="text-primary-foreground/80 mb-8 flex-1">
                  If you want to be a headline sponsor, partner with us to create lasting impact together.
                </p>
                <PartnerSponsorDialog>
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8">
                    <Handshake className="mr-2 h-5 w-5" />
                    Partner With Us
                  </Button>
                </PartnerSponsorDialog>
              </div>
            </div>
          </div>
        </section>

        {/* Stripe Payment Section */}
        <StripePaymentForm />

        {/* Research Tracks Section */}
        <ResearchTracksSection />

        {/* Partners CTA */}
        <section className="py-20 lg:py-32 bg-primary text-primary-foreground" id="part_spon">
          <div className="container-wide text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Become a Partner & Sponsor
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-3xl mx-auto">
              Let's create impact together! Ready to team up with us? Explore exciting sponsorship and partnership possibilities.
            </p>
            <PartnerSponsorDialog>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 py-6 text-lg">
                <Handshake className="mr-2 h-5 w-5" />
                Partner With Us
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

export default JoinUs;
