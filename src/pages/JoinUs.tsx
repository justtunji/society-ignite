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
import { z } from "zod";
import { PartnerSponsorDialog } from "@/components/PartnerSponsorDialog";
import joinUsHero from "@/assets/images/join-us-team.jpeg";
import sbaLogo from "@/assets/logos/sba-logo.png";
import membershipLevelsImage from "@/assets/images/join-us-team.jpeg";
import { useSectionContent } from "@/hooks/useSectionContent";

const HERO_DEFAULTS = {
  eyebrow: 'Join Our Community',
  headline: 'Become a Member.',
  subheadline: 'Join our community of scholars, researchers, and educators committed to driving inclusive change in higher education.',
  image_url: '', cta_label: '', cta_url: '', side_image_url: '',
};
const WHY_DEFAULTS = {
  eyebrow: 'Why Join', headline: 'Benefits of SBA Membership',
  benefit_1: 'Exposure to best practices, guidance, information, and a growing professional community',
  benefit_2: 'Commitment to driving change and promoting Justice, Equity, and Fairness (JEF)',
  benefit_3: 'Improved career prospects and exposure to exciting opportunities',
  benefit_4: 'Access to a diverse network of academics at different career stages',
};
const LEVELS_DEFAULTS = { eyebrow: 'Membership Levels', headline: 'Choose Your Path' };
const APPLY_DEFAULTS = {
  eyebrow: 'Apply Now', headline: 'Support Us',
  subheadline: "Support us and you'll get to attend our conference for free.",
};

// Strip control chars / null bytes; reject obvious script/SQL injection shapes
const SAFE_TEXT = /^[^\u0000-\u001F\u007F<>]*$/;
const NO_SCRIPT = (v: string) =>
  !/<\s*script|javascript:|on\w+\s*=|<\s*iframe|--\s|;\s*drop\s|union\s+select/i.test(v);

const safeString = (label: string, max: number, min = 1) =>
  z.string()
    .trim()
    .min(min, `${label} is required`)
    .max(max, `${label} must be under ${max} characters`)
    .regex(SAFE_TEXT, `${label} contains invalid characters`)
    .refine(NO_SCRIPT, `${label} contains disallowed content`);

const MEMBERSHIP_OPTIONS = [
  'Academic and Scholar Membership (ASM)',
  'Executive Leader Membership (ELM)',
  'Industry Practitioner Membership (IPM)',
  'Student Membership (SM)',
] as const;

const RESEARCH_TRACK_OPTIONS = [
  'Law and Legal Studies',
  'Business, Management, and Economics',
  'Social Sciences',
  'Arts, Humanities, and Cultural Studies',
  'Sciences, Technology, Engineering, and Mathematics (STEM)',
  'Health, Medicine, and Life Sciences',
  'Education and Pedagogy',
  'Interdisciplinary and Cross-Cutting Research',
] as const;

const NAME_REGEX = /^[\p{L}\p{M}'’\-\s.]+$/u;

const applicationSchema = z.object({
  firstName: safeString('First name', 60).refine((v) => NAME_REGEX.test(v), 'First name contains invalid characters'),
  lastName: safeString('Last name', 60).refine((v) => NAME_REGEX.test(v), 'Last name contains invalid characters'),
  email: z.string().trim().toLowerCase().email('Invalid email address').max(254, 'Email is too long'),
  jobTitle: safeString('Job title', 120),
  institution: safeString('Institution', 160),
  membership: z.enum(MEMBERSHIP_OPTIONS, { errorMap: () => ({ message: 'Select a valid membership level' }) }),
  researchTrack: z.enum(RESEARCH_TRACK_OPTIONS, { errorMap: () => ({ message: 'Select a valid research track' }) }),
});

const JoinUs = () => {
  const hero = useSectionContent('join-us', 'hero', HERO_DEFAULTS);
  const why = useSectionContent('join-us', 'why_join', WHY_DEFAULTS);
  const levelsIntro = useSectionContent('join-us', 'levels_intro', LEVELS_DEFAULTS);
  const applyIntro = useSectionContent('join-us', 'apply_intro', APPLY_DEFAULTS);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<null | typeof formData>(null);
  const [honeypot, setHoneypot] = useState('');
  const [mountedAt] = useState(() => Date.now());
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
    if (isSubmitting || submitted) return;

    // Bot defences: honeypot + time trap (humans take >2s)
    if (honeypot.trim().length > 0 || Date.now() - mountedAt < 2000) {
      console.warn('Spam submission blocked.');
      toast({
        title: "Submission blocked",
        description: "Your submission could not be processed.",
        variant: "destructive",
      });
      return;
    }

    // Validate & sanitize
    const parsed = applicationSchema.safeParse(formData);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Please check your inputs.';
      toast({ title: "Invalid input", description: firstError, variant: "destructive" });
      return;
    }
    const clean = parsed.data;

    setIsSubmitting(true);
    try {
      const fullName = `${clean.firstName} ${clean.lastName}`;
      const memberId = crypto.randomUUID();

      // Save to members table — auto-accept on submission
      const { error } = await supabase
        .from('members')
        .insert([{
          id: memberId,
          name: fullName,
          email: clean.email,
          category: clean.membership,
          is_verified: true,
          preferences: {
            jobTitle: clean.jobTitle,
            institution: clean.institution,
            researchTrack: clean.researchTrack,
          },
        }]);

      // Hard-block duplicates by email (unique constraint)
      if (error && 'code' in error && (error as any).code === '23505') {
        toast({
          title: "Already a member",
          description: "An application with this email already exists. Please use a different email or contact us if you need help.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      if (error) throw error;

      // Subscribe to Mailchimp (non-blocking)
      await subscribeToMailchimp({
        email: clean.email,
        name: fullName,
        source: 'membership-application',
        tags: ['New Member', 'Accepted', clean.membership, clean.researchTrack].filter(Boolean),
        merge_fields: {
          JOBTITLE: clean.jobTitle,
          INSTITUT: clean.institution,
          MEMLEVEL: clean.membership,
          TRACK: clean.researchTrack,
          STATUS: 'Accepted',
        },
        member_id: memberId,
      }).catch(err => console.warn('Mailchimp subscription failed (non-blocking):', err));

      // Send welcome / acceptance email immediately
      await supabase.functions.invoke('send-welcome-email', {
        body: {
          email: clean.email,
          name: fullName,
          category: clean.membership,
          track: clean.researchTrack,
        },
      }).catch(err => console.warn('Welcome email failed (non-blocking):', err));

      toast({
        title: "Welcome to SBA!",
        description: "Your application has been accepted. Check your inbox for a welcome email.",
      });

      setSubmittedData({ ...formData, ...clean });
      setSubmitted(true);
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
        {hero && (
          <section className="relative min-h-[80vh] flex items-center bg-primary">
            <div className="absolute inset-0">
              <img
                src={hero.image_url || joinUsHero}
                alt="Join Society of Black Academics"
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-primary/80"></div>
            </div>

            <div className="relative z-10 container-wide py-32">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-primary-foreground">
                  <p className="text-accent font-medium text-lg mb-4">{hero.eyebrow}</p>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                    {hero.headline}
                  </h1>
                  <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed">
                    {hero.subheadline}
                  </p>
                </div>

                <div className="hidden lg:flex justify-center">
                  <img
                    src={hero.side_image_url || membershipLevelsImage}
                    alt="SBA Membership Levels"
                    className="max-w-md rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Benefits Section */}
        {why && (
          <section className="py-20 lg:py-32 bg-background">
            <div className="container-wide">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">{why.eyebrow}</h4>
                  <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">
                    {why.headline}
                  </h2>
                  <div className="space-y-6">
                    {[why.benefit_1, why.benefit_2, why.benefit_3, why.benefit_4].filter(Boolean).map((benefit, index) => (
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
                  src={hero.side_image_url || membershipLevelsImage}
                  alt="SBA Membership Levels"
                  className="max-w-sm rounded-lg shadow-xl"
                />
              </div>
              </div>
            </div>
          </section>
        )}

        {/* Membership Levels */}
        {levelsIntro && (
        <section className="py-20 lg:py-32 bg-muted/30">
          <div className="container-wide">
            <div className="text-center mb-16">
              <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">{levelsIntro.eyebrow}</h4>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                {levelsIntro.headline}
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
        )}

        {/* Membership Form */}
        <section className="py-20 lg:py-32 bg-background" id="b-a-m">
          <div className="container-wide">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">{applyIntro?.eyebrow}</h4>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {applyIntro?.headline}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {applyIntro?.subheadline}
                </p>
              </div>
              
              <div className="bg-muted/30 rounded-2xl p-8 lg:p-12">
                {submitted && submittedData ? (
                  <div className="text-center space-y-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center">
                      <Check className="h-8 w-8 text-accent" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground">Application received</h3>
                      <p className="text-muted-foreground">
                        Thanks, {submittedData.firstName}. We've sent a confirmation to{" "}
                        <span className="font-semibold text-foreground">{submittedData.email}</span> with the details below.
                        Your SBA membership has been accepted automatically.
                      </p>
                    </div>
                    <div className="text-left bg-background rounded-xl p-6 border border-border space-y-2 text-sm">
                      <p><span className="font-semibold">Name:</span> {submittedData.firstName} {submittedData.lastName}</p>
                      <p><span className="font-semibold">Email:</span> {submittedData.email}</p>
                      <p><span className="font-semibold">Job title:</span> {submittedData.jobTitle}</p>
                      <p><span className="font-semibold">Institution:</span> {submittedData.institution}</p>
                      <p><span className="font-semibold">Membership level:</span> {submittedData.membership}</p>
                      <p><span className="font-semibold">Research track:</span> {submittedData.researchTrack}</p>
                      <p className="pt-2"><span className="font-semibold">Status:</span> <span className="inline-block px-2 py-0.5 rounded-full bg-accent/15 text-accent text-xs font-semibold">Accepted</span></p>
                    </div>
                    <Button asChild size="lg" className="rounded-full px-8 bg-accent text-accent-foreground hover:bg-accent/90">
                      <a href="/">Back to homepage</a>
                    </Button>
                  </div>
                ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Honeypot — hidden from humans, attractive to bots */}
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
                    <label htmlFor="company_website">Website</label>
                    <input
                      type="text"
                      id="company_website"
                      name="company_website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>
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
                    disabled={isSubmitting || submitted}
                    size="lg"
                    className="w-full rounded-full px-8 py-6 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
                )}
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
