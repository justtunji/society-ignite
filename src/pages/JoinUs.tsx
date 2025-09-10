import { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Check, Users, GraduationCap, Briefcase, School } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const JoinUs = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    institution: '',
    membership: ''
  });

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
      title: "Academic and Scholar Membership (ASM)",
      icon: GraduationCap,
      description: "For scholars at all levels from early career researcher (ECR) stage to senior academics at the Associate and Full Professorial levels.",
      benefits: [
        "Career development opportunities",
        "Networking with junior and senior academics",
        "Mentorship and leadership development",
        "Access to professional guidance"
      ]
    },
    {
      title: "Executive Leader Membership (ELM)",
      icon: Briefcase,
      description: "For current directors, managers, and leaders within the Higher Education sector such as Deans, Directors, Pro-Vice Chancellors, and Vice Chancellors.",
      benefits: [
        "Leadership development insights",
        "Understanding diverse staff challenges",
        "Strategic guidance on inclusion",
        "Executive networking opportunities"
      ]
    },
    {
      title: "Industry Practitioner Membership (IPM)",
      icon: Users,
      description: "For non-academic professionals wanting to transition into academia or practitioners who regularly engage with the scholarly community.",
      benefits: [
        "Academic transition guidance",
        "Knowledge exchange opportunities",
        "Collaborative learning experiences",
        "Professional network access"
      ]
    },
    {
      title: "Student Membership (SM)",
      icon: School,
      description: "For current postgraduate students enrolled in Masters (MSc, MPhil) or PhD programs.",
      benefits: [
        "Engagement with senior academics",
        "Career guidance and mentorship",
        "Community knowledge sharing",
        "Academic career preparation"
      ]
    }
  ];

  const benefits = [
    "Exposure to best practices, guidance, information, and a growing professional community",
    "Commitment to driving change and promoting Justice, Equity, and Fairness (JEF) for Black Academics in Higher Education",
    "Improved career prospects and exposure to exciting opportunities",
    "Access to a diverse network of academics and non-academics at different career stages"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      membership: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('members')
        .insert([
          {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            category: formData.membership,
            preferences: {
              jobTitle: formData.jobTitle,
              institution: formData.institution
            }
          }
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Membership application submitted!",
        description: "Thank you for joining the Society of Black Academics. We'll be in touch soon.",
      });

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        jobTitle: '',
        institution: '',
        membership: ''
      });
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
      <Header logoUrl="/lovable-uploads/logo@2x.png" siteName="Society of Black Academics" />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-b from-background to-muted/20">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="heading-xl mb-6">Become a Member</h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Join our community of scholars, researchers, and educators committed to driving inclusive change in higher education.
              </p>
              <div className="max-w-md mx-auto">
                <img 
                  src="https://societyofblackacademics.com/wp-content/uploads/2023/08/SBA-Logo.jpg"
                  alt="Society of Black Academics Logo"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section-padding">
          <div className="container-wide">
            <h2 className="heading-lg mb-8 text-center">Benefits of SBA Membership</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Levels */}
        <section className="section-padding bg-muted/20">
          <div className="container-wide">
            <h2 className="heading-lg mb-8 text-center">Levels of Membership</h2>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              Membership of the Society of Black Academics is divided into four key levels:
            </p>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {membershipLevels.map((level, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <level.icon className="h-8 w-8 text-primary" />
                      <h3 className="heading-sm">{level.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">{level.description}</p>
                    <div className="space-y-2">
                      {level.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Form */}
        <section className="section-padding" id="b-a-m">
          <div className="container-wide">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <h2 className="heading-lg mb-6 text-center">Membership Form</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your email address"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title *</Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your job title"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution *</Label>
                      <Input
                        id="institution"
                        name="institution"
                        value={formData.institution}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your institution"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="membership">Membership Level *</Label>
                      <Select value={formData.membership} onValueChange={handleSelectChange}>
                        <SelectTrigger>
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
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Partners & Sponsors Section */}
        <section className="section-padding bg-muted/20" id="part_spon">
          <div className="container-wide">
            <div className="text-center">
              <h2 className="heading-lg mb-6">Become our Partners & Sponsors</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Let's Create Impact together! Ready to team up with us? Fill out this quick registration form to explore exciting sponsorship and partnership possibilities. Join forces for success!
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
              >
                Partner With Us
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

export default JoinUs;