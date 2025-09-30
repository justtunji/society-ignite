import { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import contactHero from "@/assets/images/contact-hero.jpg";
import sbaLogo from "@/assets/logos/sba-logo.png";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    document.title = "Contact Us | Society of Black Academics";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get in touch with the Society of Black Academics. Contact us for membership, partnerships, or general inquiries.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Get in touch with the Society of Black Academics. Contact us for membership, partnerships, or general inquiries.';
      document.head.appendChild(meta);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            source_page: 'contact'
          }
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Message sent successfully!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later or contact us directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header logoUrl={sbaLogo} siteName="Society of Black Academics" />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img 
              src={contactHero} 
              alt="Contact Society of Black Academics"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/80"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 text-center text-white container-wide animate-fade-in">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Mail className="h-12 w-12 animate-bounce-soft" />
              <h1 className="hero-title">Get in Touch</h1>
            </div>
            <p className="hero-subtitle max-w-3xl mx-auto">
              We'd love to hear from you. Whether you have questions about membership, partnerships, or want to get involved, we're here to help.
            </p>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="section-padding bg-gradient-to-br from-teal-50 via-background to-emerald-50">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="heading-lg mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                        />
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
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="What is this regarding?"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="heading-lg mb-6">Contact Information</h2>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Email</h3>
                          <p className="text-muted-foreground">info@societyofblackacademics.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <Phone className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Phone</h3>
                          <p className="text-muted-foreground">Available upon request</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <MapPin className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Location</h3>
                          <p className="text-muted-foreground">United Kingdom</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <h3 className="heading-md mb-4">Quick Links</h3>
                    <div className="space-y-3">
                      <a 
                        href="/join-us" 
                        className="block text-primary hover:underline"
                      >
                        Become a Member
                      </a>
                      <a 
                        href="/about#part_spon" 
                        className="block text-primary hover:underline"
                      >
                        Partnership Opportunities
                      </a>
                      <a 
                        href="https://www.linkedin.com/company/society-of-black-academics/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-primary hover:underline"
                      >
                        Follow us on LinkedIn
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <h3 className="heading-md mb-4">Office Hours</h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p>Monday - Friday: 9:00 AM - 5:00 PM (GMT)</p>
                      <p>Saturday - Sunday: Closed</p>
                      <p className="text-sm mt-4">
                        We aim to respond to all inquiries within 48 hours during business days.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-gradient-to-br from-purple-50 via-background to-coral-50">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto">
              <h2 className="heading-lg mb-8 text-center">Frequently Asked Questions</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">How do I become a member?</h3>
                    <p className="text-muted-foreground text-sm">
                      Visit our Join Us page to learn about membership levels and complete the membership form. Membership is open to academics, practitioners, and students.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">What events do you organize?</h3>
                    <p className="text-muted-foreground text-sm">
                      We organize annual conferences, workshops, networking events, and professional development sessions. Check our gallery for photos from past events.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">How can my organization partner with SBA?</h3>
                    <p className="text-muted-foreground text-sm">
                      We welcome partnerships with universities, organizations, and companies that share our mission. Contact us to discuss sponsorship and collaboration opportunities.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Do you offer mentorship programs?</h3>
                    <p className="text-muted-foreground text-sm">
                      Yes, we facilitate mentoring relationships between experienced academics and early career researchers. Contact us to learn more about our mentorship initiatives.
                    </p>
                  </CardContent>
                </Card>
              </div>
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

export default Contact;