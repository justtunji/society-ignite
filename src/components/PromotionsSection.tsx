import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface Promotion {
  id: string;
  title: string;
  sponsor_name?: string;
  image_url?: string;
  short_description?: string;
  link?: string;
  featured: boolean;
}

export const PromotionsSection = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  // Sample promotion data - in production this would come from Supabase
  useEffect(() => {
    setPromotions([
      {
        id: '1',
        title: 'Academic Excellence Scholarship',
        sponsor_name: 'Education Foundation',
        image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop',
        short_description: 'Scholarship opportunities for outstanding Black academics pursuing advanced degrees in higher education.',
        link: 'https://example.com/scholarship',
        featured: true
      },
      {
        id: '2',
        title: 'Research Grant Program',
        sponsor_name: 'Research Institute',
        image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop',
        short_description: 'Competitive funding for groundbreaking research projects that advance knowledge and promote diversity.',
        link: 'https://example.com/grants',
        featured: true
      },
      {
        id: '3',
        title: 'Leadership Development Program',
        sponsor_name: 'Academic Leadership Institute',
        image_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop',
        short_description: 'Intensive program designed to develop the next generation of academic leaders.',
        link: 'https://example.com/leadership',
        featured: true
      }
    ]);
  }, []);

  const featuredPromotions = promotions.filter(promotion => promotion.featured);

  if (featuredPromotions.length === 0) return null;

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-medium text-foreground mb-4">
            Featured Opportunities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover scholarships, grants, and programs designed to support Black academics in their educational journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPromotions.map((promotion) => (
            <Card key={promotion.id} className="card-hover overflow-hidden">
              {promotion.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={promotion.image_url}
                    alt={promotion.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl font-medium">
                  {promotion.title}
                </CardTitle>
                {promotion.sponsor_name && (
                  <CardDescription className="text-accent font-medium">
                    {promotion.sponsor_name}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {promotion.short_description && (
                  <p className="text-muted-foreground">
                    {promotion.short_description}
                  </p>
                )}
                {promotion.link && (
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full group"
                  >
                    <a
                      href={promotion.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn More
                      <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};