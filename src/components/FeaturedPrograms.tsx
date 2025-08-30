import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

interface Program {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  program_type?: string;
  start_date?: string;
  end_date?: string;
  location_mode?: string;
  location_text?: string;
  tags: string[];
}

export const FeaturedPrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);

  // Sample program data - in production this would come from Supabase
  useEffect(() => {
    setPrograms([
      {
        id: '1',
        title: 'Academic Mentorship Program',
        slug: 'academic-mentorship-program',
        short_description: 'Connect with experienced academics for career guidance and professional development in higher education.',
        program_type: 'Mentorship',
        start_date: '2024-09-01',
        end_date: '2025-06-30',
        location_mode: 'hybrid',
        location_text: 'Online & Regional Meetups',
        tags: ['mentorship', 'career-development', 'networking']
      },
      {
        id: '2',
        title: 'Research Fellowship Initiative',
        slug: 'research-fellowship-initiative',
        short_description: 'Funding and institutional support for groundbreaking research projects led by Black academics.',
        program_type: 'Fellowship',
        start_date: '2024-10-15',
        end_date: '2025-10-15',
        location_mode: 'in-person',
        location_text: 'Partner Universities',
        tags: ['research', 'funding', 'fellowship', 'innovation']
      }
    ]);
  }, []);

  if (programs.length === 0) return null;

  return (
    <section className="section-padding">
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

                {program.tags.length > 0 && (
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