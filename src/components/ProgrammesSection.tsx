import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import sbaImage1 from "@/assets/images/gallery/sba-event-3.jpeg";
import { cldUrl, cldSrcSet } from '@/lib/cloudinary';
import { useSectionContent } from "@/hooks/useSectionContent";

const DEFAULTS = {
  eyebrow: 'Our programmes',
  paragraph: 'We support the career development and success of Black academics across the UK by empowering universities, corporations, and research institutions with the insights, recommendations and support to implement authentic and effective diversity initiatives.',
  cta_label: 'Learn more',
  cta_url: '/resources',
  image_url: '',
};

interface Program {
  id: string;
  title: string;
  short_description: string | null;
  hero_image_url: string | null;
  updated_at?: string | null;
}

export const ProgrammesSection = () => {
  const c = useSectionContent('home', 'programmes_intro', DEFAULTS);
  const [program, setProgram] = useState<Program | null>(null);

  useEffect(() => {
    const fetchProgram = async () => {
      const { data } = await supabase
        .from('programs')
        .select('id, title, short_description, hero_image_url, updated_at')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) setProgram(data);
    };
    fetchProgram();
  }, []);

  if (!c) return null;

  const imageUrl = program?.hero_image_url || c.image_url || sbaImage1;
  const description = program?.short_description || c.paragraph;

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-0 items-stretch">
          <div className="relative bg-muted min-h-[400px] lg:min-h-[600px] flex items-center justify-center">
            <img
              src={cldUrl(imageUrl, { w: 1200, c: 'fit', bust: program?.updated_at })}
              srcSet={cldSrcSet(imageUrl, [600, 1200, 1600], { c: 'fit', bust: program?.updated_at })}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt={program?.title || "SBA Programme"}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="bg-background p-8 lg:p-16 flex flex-col justify-center">
            {c.eyebrow && (
              <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">{c.eyebrow}</h4>
            )}
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">{description}</p>
            {c.cta_label && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-fit rounded-full px-8 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <a href={c.cta_url || '/resources'}>
                  {c.cta_label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

