import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import sba1 from "@/assets/images/gallery/sba1.jpeg";
import sba2 from "@/assets/images/gallery/sba2.jpeg";
import sba3 from "@/assets/images/gallery/sba4.jpeg";

interface Story {
  id: string;
  title: string;
  image: string;
  link: string;
}

export const LatestStoriesSection = () => {
  const stories: Story[] = [
    {
      id: '1',
      title: '4th Annual SBA Conference: Highlights and Key Takeaways',
      image: sba1,
      link: '/gallery'
    },
    {
      id: '2',
      title: 'Building Networks: The Power of Academic Community',
      image: sba2,
      link: '/gallery'
    },
    {
      id: '3',
      title: 'Research Excellence: Celebrating Black Academic Achievement',
      image: sba3,
      link: '/gallery'
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container-wide">
        {/* Header */}
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
        
        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <a 
              key={story.id}
              href={story.link}
              className="group block"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                <img 
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
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
