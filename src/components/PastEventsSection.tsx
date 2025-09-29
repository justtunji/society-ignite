import { Play } from "lucide-react";
import { useState } from "react";

interface VideoEvent {
  id: string;
  title: string;
  videoId: string;
  category: string;
}

export const PastEventsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const pastEvents: VideoEvent[] = [
    {
      id: '1',
      title: 'Impactful Research and Scholarship (Part 1)',
      videoId: '4JttSPOHnLU',
      category: 'research'
    },
    {
      id: '2', 
      title: 'Entering the academic market and progressing on the job',
      videoId: '3m2pFRVPqd8',
      category: 'career'
    },
    {
      id: '3',
      title: '4th Annual Conference of SBA 2024 at University of Bristol',
      videoId: 'DW0vzXlfDc',
      category: 'networking'
    },
    {
      id: '4',
      title: 'Impactful Research and Scholarship (Part 2)',
      videoId: 'pOzIB12iz9s',
      category: 'research'
    },
    {
      id: '5',
      title: '3rd Annual Conference of the Society of Black Academics',
      videoId: 'mSao58lLKzA',
      category: 'career'
    },
    {
      id: '6',
      title: 'Building Inclusive Research Environments',
      videoId: '3m2pFRVPqd8',
      category: 'research'
    },
    {
      id: '7',
      title: 'Networking and Professional Development',
      videoId: 'ILv2WvgxnA8',
      category: 'networking'
    },
    {
      id: '8',
      title: 'Research Excellence and Impact',
      videoId: '5PVqaAIEhe0',
      category: 'research'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Events' },
    { id: 'research', label: 'Research' },
    { id: 'career', label: 'Career Development' },
    { id: 'networking', label: 'Networking' }
  ];

  const filteredEvents = selectedCategory === 'all' 
    ? pastEvents.slice(0, 4)
    : pastEvents.filter(event => event.category === selectedCategory).slice(0, 4);

  return (
    <section className="section-padding bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container-wide">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <Play className="h-4 w-4" />
            Video Library
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Our Past Events
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive collection of recorded conferences, workshops, and expert discussions 
            on academic careers, research excellence, and professional development
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Videos Grid - Single Row, 4 Videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {filteredEvents.map((event, index) => (
            <div 
              key={event.id} 
              className="group animate-fade-in"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="overflow-hidden rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/20 relative">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${event.videoId}?rel=0`}
                    title={event.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="rounded-xl transform transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                
                {/* Video Title */}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
                    {event.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
