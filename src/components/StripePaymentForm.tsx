import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Check, Star, Crown, Zap } from "lucide-react";

const membershipPlans = [
  {
    id: 'student',
    name: 'Student Membership (SM)',
    price: 15,
    interval: 'year',
    description: 'For current postgraduate students enrolled in Masters (MSc, MPhil) or PhD programs',
    icon: Star,
    features: [
      'Engagement with senior academics',
      'Career guidance and mentorship',
      'Community knowledge sharing',
      'Academic career preparation',
      'Access to all SBA events'
    ],
    popular: false
  },
  {
    id: 'academic',
    name: 'Academic and Scholar Membership (ASM)',
    price: 50,
    interval: 'year',
    description: 'For scholars at all levels from early career researcher (ECR) stage to senior academics',
    icon: CreditCard,
    features: [
      'Career development opportunities',
      'Networking with junior and senior academics',
      'Mentorship and leadership development',
      'Access to professional guidance',
      'Priority event booking',
      'Exclusive workshops'
    ],
    popular: true
  },
  {
    id: 'industry',
    name: 'Industry Practitioner Membership (IPM)',
    price: 75,
    interval: 'year',
    description: 'For non-academic professionals wanting to transition into academia',
    icon: Zap,
    features: [
      'Academic transition guidance',
      'Knowledge exchange opportunities',
      'Collaborative learning experiences',
      'Professional network access',
      'Industry-academia networking'
    ],
    popular: false
  },
  {
    id: 'executive',
    name: 'Executive Leader Membership (ELM)',
    price: 150,
    interval: 'year',
    description: 'For current directors, managers, and leaders within the Higher Education sector',
    icon: Crown,
    features: [
      'Leadership development insights',
      'Understanding diverse staff challenges',
      'Strategic guidance on inclusion',
      'Executive networking opportunities',
      'Senior leadership forums',
      'Annual strategic consultation'
    ],
    popular: false
  }
];

export const StripePaymentForm = () => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (planId: string) => {
    setIsProcessing(true);
    setSelectedPlan(planId);

    try {
      // This is where you would integrate with Stripe
      // For now, we'll simulate the payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment processing...",
        description: "You will be redirected to Stripe to complete your payment.",
      });

      // In a real implementation, you would:
      // 1. Call your backend to create a Stripe Checkout session
      // 2. Redirect to Stripe Checkout
      // Example:
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ planId })
      // });
      // const { url } = await response.json();
      // window.location.href = url;

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4">Complete Your Membership</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose a membership plan to unlock exclusive benefits and support our mission. Secure payment powered by Stripe.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {membershipPlans.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 hover:shadow-lg ${
                plan.popular ? 'border-accent shadow-md' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  <Icon className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">£{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePayment(plan.id)}
                  disabled={isProcessing}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90' 
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {isProcessing && selectedPlan === plan.id ? (
                    <>
                      <CreditCard className="w-4 h-4 mr-2 animate-pulse" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Choose {plan.name}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Secure payment powered by Stripe. Cancel anytime.</p>
          <p className="mt-2">
            Questions about membership? <a href="/contact" className="text-accent hover:underline">Contact us</a>
          </p>
        </div>
      </div>
    </section>
  );
};