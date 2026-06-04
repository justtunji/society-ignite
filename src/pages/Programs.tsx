import { useEffect, useState } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Calendar, MapPin, Filter } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { cldUrl, cldSrcSet } from '@/lib/cloudinary';
import sbaLogo from "@/assets/logos/sba-logo.png";

interface Program {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  hero_image_url: string | null;
  program_type: string | null;
  start_date: string | null;
  end_date: string | null;
  location_mode: string | null;
  location_text: string | null;
  tags: string[] | null;
  status: string | null;
  application_url: string | null;
  eligibility: string | null;
  updated_at?: string | null;
}

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [programTypes, setProgramTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      const { data } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) {
        setPrograms(data);
        const types = [...new Set(data.map(p => p.program_type).filter(Boolean))] as string[];
        setProgramTypes(types);
      }
      setLoading(false);
    };
    fetchPrograms();
  }, []);

  const filtered = programs.filter(p => {
    if (typeFilter !== 'all' && p.program_type !== typeFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header siteName="Society of Black Academics" logoUrl={sbaLogo} />

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 lg:py-28">
        <div className="container-wide text-center">
          <h1 className="text-4xl lg:text-5xl font-medium mb-4">Our Programs</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Explore our signature programs designed to support and advance Black academics across the UK
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="container-wide flex flex-wrap gap-4 items-center">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Program Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {programTypes.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          {(typeFilter !== 'all' || statusFilter !== 'all') && (
            <Button variant="ghost" size="sm" onClick={() => { setTypeFilter('all'); setStatusFilter('all'); }}>
              Clear filters
            </Button>
          )}
        </div>
      </section>

      {/* Programs Grid */}
      <section className="section-padding">
        <div className="container-wide">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No programs found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(program => (
                <Card key={program.id} className="card-hover flex flex-col">
                  {program.hero_image_url && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={program.hero_image_url}
                        alt={program.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <CardHeader className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg font-medium">{program.title}</CardTitle>
                      {program.status && (
                        <Badge variant={program.status === 'active' ? 'default' : 'secondary'} className="shrink-0 text-xs">
                          {program.status}
                        </Badge>
                      )}
                    </div>
                    {program.program_type && (
                      <Badge variant="outline" className="w-fit text-xs">{program.program_type}</Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {program.short_description && (
                      <CardDescription className="text-sm leading-relaxed line-clamp-3">
                        {program.short_description}
                      </CardDescription>
                    )}
                    <div className="space-y-1.5 text-sm text-muted-foreground">
                      {program.start_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {new Date(program.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {program.end_date && ` – ${new Date(program.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                          </span>
                        </div>
                      )}
                      {program.location_text && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{program.location_text}</span>
                        </div>
                      )}
                    </div>
                    {program.tags && program.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {program.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                    {program.application_url && (
                      <Button asChild variant="outline" size="sm" className="w-full group mt-2">
                        <a href={program.application_url} target="_blank" rel="noopener noreferrer">
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer siteName="Society of Black Academics" />
    </div>
  );
};

export default Programs;
