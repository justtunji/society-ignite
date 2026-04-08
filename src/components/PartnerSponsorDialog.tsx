import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { subscribeToMailchimp } from "@/lib/mailchimp";
import { Building2, Handshake } from "lucide-react";

interface PartnerSponsorDialogProps {
  children: React.ReactNode;
}

export const PartnerSponsorDialog = ({ children }: PartnerSponsorDialogProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    partnershipType: '',
    budget: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
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
            name: formData.contactName,
            email: formData.email,
            subject: `Partnership Inquiry from ${formData.companyName}`,
            message: `Company: ${formData.companyName}
Contact: ${formData.contactName}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Website: ${formData.website || 'Not provided'}
Partnership Type: ${formData.partnershipType}
Budget Range: ${formData.budget || 'Not specified'}

Message:
${formData.message}`,
            source_page: 'Partner/Sponsor Form'
          }
        ]);

      if (error) throw error;

      // Subscribe to Mailchimp with Partner tag
      try {
        await subscribeToMailchimp({
          email: formData.email,
          name: formData.contactName,
          source: 'partner-sponsor-form',
          tags: ['Partner Inquiry', formData.partnershipType],
          merge_fields: {
            COMPANY: formData.companyName,
            PTYPE: formData.partnershipType,
          },
        });
      } catch (mcError) {
        console.error('Mailchimp subscription error (non-blocking):', mcError);
      }

      toast({
        title: "Partnership inquiry submitted!",
        description: "Thank you for your interest. We'll be in touch soon to discuss partnership opportunities.",
      });

      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        partnershipType: '',
        budget: '',
        message: ''
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting partnership inquiry:', error);
      toast({
        title: "Error submitting inquiry",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Handshake className="h-6 w-6 text-accent" />
            Partner & Sponsor with SBA
          </DialogTitle>
          <DialogDescription>
            Join us in driving inclusive change in higher education. Fill out the form below to explore partnership opportunities.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                placeholder="Your organization"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                required
                placeholder="Your name"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="contact@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+44 20 1234 5678"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Company Website</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://www.yourcompany.com"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partnershipType">Partnership Type *</Label>
              <Select value={formData.partnershipType} onValueChange={(value) => handleSelectChange('partnershipType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event-sponsorship">Event Sponsorship</SelectItem>
                  <SelectItem value="program-partnership">Program Partnership</SelectItem>
                  <SelectItem value="research-collaboration">Research Collaboration</SelectItem>
                  <SelectItem value="strategic-partnership">Strategic Partnership</SelectItem>
                  <SelectItem value="conference-sponsorship">Conference Sponsorship</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Select value={formData.budget} onValueChange={(value) => handleSelectChange('budget', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-5k">Under £5,000</SelectItem>
                  <SelectItem value="5k-15k">£5,000 - £15,000</SelectItem>
                  <SelectItem value="15k-50k">£15,000 - £50,000</SelectItem>
                  <SelectItem value="50k-plus">£50,000+</SelectItem>
                  <SelectItem value="to-discuss">To be discussed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Additional Information</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tell us about your partnership goals and how you'd like to collaborate with SBA..."
              rows={4}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.companyName || !formData.contactName || !formData.email || !formData.partnershipType}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};