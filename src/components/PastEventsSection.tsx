import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Calendar, Clock, Users } from "lucide-react";
import { useState } from "react";

interface VideoEvent {
  id: string;
  title: string;
  videoId: string;
  duration: string;
  description: string;
  date: string;
  views: string;
  category: string;
  thumbnail?: string;
}

export const PastEventsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const pastEvents: VideoEvent[] = [
    {
      id: '1',
      title: 'Impactful Research and Scholarship (Part 1)',
      videoId: '4JttSPOHnLU',
      duration: '3:01:34',
      description: 'Expert panel discussion on conducting impactful research and building a strong academic portfolio',
      date: 'March 2024',
      views: '2.1K',
      category: 'research'
    },
    {
      id: '2', 
      title: 'Entering the academic market and progressing on the job',
      videoId: '3m2pFRVPqd8',
      duration: '2:48:03',
      description: 'Comprehensive guide to navigating academic job markets and career advancement strategies',
      date: 'February 2024',
      views: '1.8K',
      category: 'career'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Events' },
    { id: 'research', label: 'Research' },
    { id: 'career', label: 'Career Development' },
    { id: 'networking', label: 'Networking' }
  ];

  const filteredEvents = selectedCategory === 'all' 
    ? pastEvents 
    : pastEvents.filter(event => event.category === selectedCategory);

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

        {/* Videos Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-16">
          {filteredEvents.map((event, index) => (
            <div 
              key={event.id} 
              className="group animate-fade-in"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <Card className="card-hover overflow-hidden h-full bg-card/50 backdrop-blur-sm border-border/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2">
                {/* Video Container */}
                <div className="relative overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center relative group">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${event.videoId}?rel=0`}
                      title={event.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="rounded-t-lg transform transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3 bg-black/90 text-white px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {event.duration}
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm uppercase tracking-wide">
                      {event.category}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {event.views} views
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {event.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Play className="h-4 w-4" />
                      <span className="font-medium">Society of Black Academics</span>
                    </div>
                    <button className="text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-300">
                      Watch Now →
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-8 md:p-12" style={{ animationDelay: '0.6s' }}>
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Stay Updated with Our Latest Content
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Subscribe to our YouTube channel for exclusive access to the latest videos, 
              event recordings, and expert insights in academic development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.youtube.com/channel/UC2mDgBLZlUUjipwEHVZuy-w"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/25"
              >
                <Play className="h-5 w-5" />
                Subscribe to Our Channel
              </a>
              <button className="inline-flex items-center gap-3 bg-card text-foreground px-8 py-4 rounded-full font-medium hover:bg-muted/50 transition-all duration-300 transform hover:scale-105 border border-border">
                <Calendar className="h-5 w-5" />
                View Upcoming Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};