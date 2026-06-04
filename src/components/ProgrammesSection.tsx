import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import sbaImage1 from "@/assets/images/gallery/sba-event-3.jpeg";
import { cldUrl, cldSrcSet } from '@/lib/cloudinary';

interface Program {
  id: string;
  title: string;
  short_description: string | null;
  hero_image_url: string | null;
}

export const ProgrammesSection = () => {
  const [program, setProgram] = useState<Program | null>(null);

  useEffect(() => {
    const fetchProgram = async () => {
      const { data } = await supabase
        .from('programs')
        .select('id, title, short_description, hero_image_url')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) setProgram(data);
    };
    fetchProgram();
  }, []);

  const imageUrl = program?.hero_image_url || sbaImage1;
  const description = program?.short_description || 
    'We support the career development and success of Black academics across the UK by empowering universities, corporations, and research institutions with the insights, recommendations and support to implement authentic and effective diversity initiatives.';

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-0 items-stretch">
          {/* Left - Images */}
          <div className="relative bg-muted min-h-[400px] lg:min-h-[600px] flex items-center justify-center">
            <img 
              src={imageUrl}
              alt={program?.title || "SBA Programme"}
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Right - Content */}
          <div className="bg-background p-8 lg:p-16 flex flex-col justify-center">
            <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Our programmes
            </h4>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {description}
            </p>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="w-fit rounded-full px-8 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <a href="/resources">
                Learn more
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
