import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { subscribeToMailchimp } from "@/lib/mailchimp";
import { useSectionContent } from "@/hooks/useSectionContent";

const DEFAULTS = {
  headline: 'Stay Connected',
  subheadline: 'Join our mailing list to receive updates on programmes, events, and resources designed to support Black academics in their journey.',
  footnote: 'We respect your privacy. Unsubscribe at any time.',
};

export const NewsletterSection = () => {
  const c = useSectionContent('home', 'newsletter', DEFAULTS);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setIsSubmitting(true);
    
    try {
      await subscribeToMailchimp({
        email,
        name,
        source: 'newsletter',
        tags: ['Newsletter', ...(category ? [category] : [])],
        merge_fields: category ? { CATEGORY: category } : {},
      });
      
      setIsSubscribed(true);
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for joining our community. You'll receive updates about our programs and events.",
      });
      
      setEmail('');
      setName('');
      setCategory('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing to our newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!c) return null;

  if (isSubscribed) {
    return (
      <section className="py-20 lg:py-32 bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-accent mb-6" />
            <h3 className="text-3xl font-bold mb-4">Welcome to our community!</h3>
            <p className="text-primary-foreground/80 text-lg">
              You'll receive updates about our programs, events, and resources for Black academics.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-32 bg-primary text-primary-foreground">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Content */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">{c.headline}</h2>
            <p className="text-primary-foreground/80 text-lg leading-relaxed">{c.subheadline}</p>
          </div>

          
          {/* Right - Form */}
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-primary-foreground">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="bg-primary-foreground text-foreground border-0 rounded-full px-6 py-6"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-primary-foreground">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-primary-foreground text-foreground border-0 rounded-full px-6 py-6"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-primary-foreground">Category (Optional)</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-primary-foreground text-foreground border-0 rounded-full px-6 py-6 h-auto">
                    <SelectValue placeholder="Select your category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                size="lg"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 py-6 text-lg font-medium"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <p className="text-sm text-primary-foreground/60 text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
