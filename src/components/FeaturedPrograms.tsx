import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface Program {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  program_type: string | null;
  start_date: string | null;
  end_date: string | null;
  location_mode: string | null;
  location_text: string | null;
  tags: string[] | null;
  status: string | null;
}

export const FeaturedPrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      const { data } = await supabase
        .from('programs')
        .select('id, title, slug, short_description, program_type, start_date, end_date, location_mode, location_text, tags, status')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(4);
      if (data) setPrograms(data);
    };
    fetchPrograms();
  }, []);

  if (programs.length === 0) return null;

  return (
    <section data-section="featured-programs" className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-medium text-foreground mb-4">
            Featured Programs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our signature programs designed to support and advance Black academics at every stage of their careers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {programs.map((program) => (
            <Card key={program.id} className="card-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl font-medium">
                      {program.title}
                    </CardTitle>
                    {program.program_type && (
                      <Badge variant="secondary" className="w-fit">
                        {program.program_type}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {program.short_description && (
                  <CardDescription className="text-base leading-relaxed">
                    {program.short_description}
                  </CardDescription>
                )}

                <div className="space-y-2 text-sm text-muted-foreground">
                  {program.start_date && program.end_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(program.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {new Date(program.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  {program.location_text && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{program.location_text}</span>
                    </div>
                  )}
                </div>

                {program.tags && program.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {program.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full group mt-4"
                >
                  <a href={`/programs/${program.slug}`}>
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <a href="/programs">
              View All Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
