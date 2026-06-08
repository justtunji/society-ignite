import { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin, Send, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { subscribeToMailchimp } from "@/lib/mailchimp";
import contactHero from "@/assets/images/contact-hero.jpg";
import sbaLogo from "@/assets/logos/sba-logo.png";
import { useSectionContent } from "@/hooks/useSectionContent";

const HERO_DEFAULTS = {
  eyebrow: 'Get in Touch',
  headline: "We'd Love to Hear From You.",
  subheadline: "Whether you have questions about membership, partnerships, or want to get involved, we're here to help.",
  image_url: '', cta_label: '', cta_url: '',
};
const INFO_DEFAULTS = {
  email: 'info@societyofblackacademics.com',
  phone: 'Available upon request',
  location: 'United Kingdom',
  hours_weekday: 'Monday - Friday: 9:00 AM - 5:00 PM (GMT)',
  hours_weekend: 'Saturday - Sunday: Closed',
  response_note: 'We aim to respond to all inquiries within 48 hours during business days.',
};

const Contact = () => {
  const hero = useSectionContent('contact', 'hero', HERO_DEFAULTS);
  const info = useSectionContent('contact', 'info', INFO_DEFAULTS);
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
      // Save to database
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          source_page: 'contact'
        }]);

      if (error) throw error;

      // Also subscribe to Mailchimp with contact tag
      await subscribeToMailchimp({
        email: formData.email,
        name: formData.name,
        source: 'contact-form',
        tags: ['Contact Form'],
      }).catch(err => console.warn('Mailchimp subscription failed (non-blocking):', err));

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
      
      <main>
        {/* Hero Section - DINN Style */}
        <section className="relative min-h-[80vh] flex items-center bg-primary">
          <div className="absolute inset-0">
            <img 
              src={contactHero} 
              alt="Contact Society of Black Academics"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-primary/80"></div>
          </div>
          
          <div className="relative z-10 container-wide py-32">
            <div className="max-w-3xl">
              <p className="text-accent font-medium text-lg mb-4">Get in Touch</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary-foreground mb-6">
                We'd Love to Hear From You.
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed">
                Whether you have questions about membership, partnerships, or want to get involved, we're here to help.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section - Split Layout */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div>
                <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Send a Message</h4>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">
                  Contact Form
                </h2>
                
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
                        className="rounded-full px-6 py-6"
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
                        className="rounded-full px-6 py-6"
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
                      className="rounded-full px-6 py-6"
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
                      className="rounded-2xl px-6 py-4"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full rounded-full px-8 py-6 bg-accent text-accent-foreground hover:bg-accent/90"
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
              </div>

              {/* Contact Information */}
              <div className="space-y-12">
                <div>
                  <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Contact Information</h4>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">Email</h3>
                        <p className="text-muted-foreground">info@societyofblackacademics.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">Phone</h3>
                        <p className="text-muted-foreground">Available upon request</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">Location</h3>
                        <p className="text-muted-foreground">United Kingdom</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-border pt-12">
                  <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
                  <div className="space-y-4">
                    <a 
                      href="/join-us" 
                      className="flex items-center text-foreground hover:text-accent transition-colors font-medium"
                    >
                      Become a Member
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                    <a 
                      href="/about#part_spon" 
                      className="flex items-center text-foreground hover:text-accent transition-colors font-medium"
                    >
                      Partnership Opportunities
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                    <a 
                      href="https://www.linkedin.com/company/society-of-black-academics/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-foreground hover:text-accent transition-colors font-medium"
                    >
                      Follow us on LinkedIn
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
                
                <div className="border-t border-border pt-12">
                  <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Office Hours</h4>
                  <div className="space-y-2 text-muted-foreground">
                    <p>Monday - Friday: 9:00 AM - 5:00 PM (GMT)</p>
                    <p>Saturday - Sunday: Closed</p>
                    <p className="text-sm mt-4">
                      We aim to respond to all inquiries within 48 hours during business days.
                    </p>
                  </div>
                </div>
              </div>
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

export default Contact;
