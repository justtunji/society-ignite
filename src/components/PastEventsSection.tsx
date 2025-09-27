import { Play } from "lucide-react";

interface VideoEvent {
  id: string;
  title: string;
  videoId: string;
}

export const PastEventsSection = () => {
  const pastEvents: VideoEvent[] = [
    {
      id: '1',
      title: 'Impactful Research and Scholarship (Part 1)',
      videoId: '4JttSPOHnLU'
    },
    {
      id: '2', 
      title: 'Entering the academic market and progressing on the job',
      videoId: '3m2pFRVPqd8'
    },
    {
      id: '3',
      title: 'SBA Student Spotlight | Rebecca Davis',
      videoId: 'ILv2WvgxnA8'
    },
    {
      id: '4',
      title: 'Black British Literature Masters Programme',
      videoId: '5PVqaAIEhe0'
    },
    {
      id: '5',
      title: 'Academic Leadership and Career Development',
      videoId: '4JttSPOHnLU'
    },
    {
      id: '6',
      title: 'Building Inclusive Research Environments',
      videoId: '3m2pFRVPqd8'
    },
    {
      id: '7',
      title: 'Networking and Professional Development',
      videoId: 'ILv2WvgxnA8'
    },
    {
      id: '8',
      title: 'Research Excellence and Impact',
      videoId: '5PVqaAIEhe0'
    }
  ];

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

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pastEvents.map((event, index) => (
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};