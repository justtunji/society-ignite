import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface Story {
  id: string;
  title: string;
  image_url: string | null;
  link: string | null;
  short_description: string | null;
}

export const LatestStoriesSection = () => {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      const { data } = await supabase
        .from('stories')
        .select('id, title, image_url, link, short_description')
        .order('order_index', { ascending: true })
        .limit(3);
      if (data) setStories(data);
    };
    fetchStories();
  }, []);

  if (stories.length === 0) return null;

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-0">
            Latest Stories
          </h2>
          <Button 
            asChild 
            variant="outline"
            size="lg"
            className="w-fit rounded-full px-8"
          >
            <a href="/gallery">
              See all posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <a 
              key={story.id}
              href={story.link || '/gallery'}
              className="group block"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                {story.image_url ? (
                  <img 
                    src={story.image_url}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors mb-2">
                {story.title}
              </h3>
              <span className="inline-flex items-center text-primary font-medium group-hover:text-accent transition-colors">
                Read More
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
