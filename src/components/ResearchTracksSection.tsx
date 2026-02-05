import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check, Scale, Briefcase, Users, Palette, Atom, Heart, GraduationCap, Layers } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Track {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const tracks: Track[] = [
  {
    id: 'law',
    title: 'Law and Legal Studies',
    description: 'Public law, private law, international law, human rights, criminology, and socio-legal studies.',
    icon: <Scale className="h-6 w-6" />
  },
  {
    id: 'business',
    title: 'Business, Management, and Economics',
    description: 'Management, finance, accounting, marketing, entrepreneurship, economics, and operations.',
    icon: <Briefcase className="h-6 w-6" />
  },
  {
    id: 'social-sciences',
    title: 'Social Sciences',
    description: 'Sociology, politics, international relations, anthropology, human geography, education, and social policy.',
    icon: <Users className="h-6 w-6" />
  },
  {
    id: 'arts-humanities',
    title: 'Arts, Humanities, and Cultural Studies',
    description: 'History, philosophy, literature, media studies, cultural studies, languages, and religion.',
    icon: <Palette className="h-6 w-6" />
  },
  {
    id: 'stem',
    title: 'Sciences, Technology, Engineering, and Mathematics (STEM)',
    description: 'Physical sciences, life sciences, engineering, computing, and mathematics.',
    icon: <Atom className="h-6 w-6" />
  },
  {
    id: 'health',
    title: 'Health, Medicine, and Life Sciences',
    description: 'Medicine, public health, nursing, psychology, biomedical sciences, and health-related research.',
    icon: <Heart className="h-6 w-6" />
  },
  {
    id: 'education',
    title: 'Education and Pedagogy',
    description: 'Education, learning sciences, curriculum studies, higher education, and pedagogy.',
    icon: <GraduationCap className="h-6 w-6" />
  },
  {
    id: 'interdisciplinary',
    title: 'Interdisciplinary and Cross-Cutting Research',
    description: 'For scholars whose work spans multiple disciplines or does not sit neatly within a single field.',
    icon: <Layers className="h-6 w-6" />
  }
];

export const ResearchTracksSection = () => {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTrack || !name || !email) {
      toast({
        title: "Please fill all fields",
        description: "Select a track and enter your name and email.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedTrackData = tracks.find(t => t.id === selectedTrack);
      
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name,
          email,
          message: `Research Track Interest: ${selectedTrackData?.title}`,
          subject: `Research Track: ${selectedTrackData?.title}`,
          source_page: 'research-tracks'
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Successfully joined!",
        description: `You've joined the ${selectedTrackData?.title} track. We'll be in touch soon.`
      });
      
      // Reset form
      setName('');
      setEmail('');
      setSelectedTrack(null);
      
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container-wide">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Research Collaboration</h4>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            SBA Research Tracks
          </h2>
          <p className="text-lg text-muted-foreground">
            Broad disciplinary tracks for collaboration and research development. Select your discipline to receive tailored updates, events, and networking opportunities.
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => setSelectedTrack(track.id)}
              className={`p-6 rounded-2xl text-left transition-all duration-300 border-2 ${
                selectedTrack === track.id
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-background border-border hover:border-primary/50'
              }`}
            >
              <div className={`mb-4 ${selectedTrack === track.id ? 'text-accent' : 'text-primary'}`}>
                {track.icon}
              </div>
              <h3 className={`font-bold mb-2 text-sm ${
                selectedTrack === track.id ? 'text-primary-foreground' : 'text-foreground'
              }`}>
                {track.title}
              </h3>
              <p className={`text-xs ${
                selectedTrack === track.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
              }`}>
                {track.description}
              </p>
              {selectedTrack === track.id && (
                <div className="mt-4 flex items-center text-accent text-sm font-medium">
                  <Check className="h-4 w-4 mr-1" />
                  Selected
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Signup Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-primary rounded-3xl p-8 lg:p-12">
            <h3 className="text-2xl font-bold text-primary-foreground mb-4 text-center">
              Join Your Research Track
            </h3>
            <p className="text-primary-foreground/80 text-center mb-8">
              {selectedTrack 
                ? `You've selected: ${tracks.find(t => t.id === selectedTrack)?.title}`
                : 'Select a track above to get started'
              }
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 h-12"
                  required
                />
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 h-12"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || !selectedTrack}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-lg font-semibold rounded-full"
              >
                {isSubmitting ? 'Joining...' : isSubmitted ? 'Joined!' : 'Join Research Track'}
                {!isSubmitting && !isSubmitted && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </form>

            <p className="text-primary-foreground/60 text-sm text-center mt-6">
              If you would like to propose a theme, please{' '}
              <a href="/contact" className="text-accent hover:underline">contact the SBA team</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
