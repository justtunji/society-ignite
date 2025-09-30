import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const NewsletterSection = () => {
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
      // In production, this would call the Supabase API to handle newsletter signup
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for joining our community. You'll receive updates about our programs and events.",
      });
      
      // Reset form
      setEmail('');
      setName('');
      setCategory('');
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing to our newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="section-padding bg-secondary/30">
        <div className="container-narrow">
          <Card className="text-center">
            <CardContent className="pt-8">
              <CheckCircle className="mx-auto h-16 w-16 text-accent mb-4" />
              <h3 className="text-2xl font-medium mb-2">Welcome to our community!</h3>
              <p className="text-muted-foreground">
                You'll receive updates about our programs, events, and resources for Black academics.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gradient-to-br from-emerald-50 via-background to-teal-50">
      <div className="container-narrow">
        <Card className="border-2 border-emerald-200/50 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-medium">
              Stay Connected
            </CardTitle>
            <CardDescription className="text-lg">
              Get updates on programs, events, and resources for Black academics
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category (Optional)</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
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
                className="w-full btn-accent" 
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
              </Button>
              
              <p className="text-sm text-muted-foreground text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};