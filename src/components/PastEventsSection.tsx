import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";

interface VideoEvent {
  id: string;
  title: string;
  videoId: string;
  duration: string;
  thumbnail?: string;
}

export const PastEventsSection = () => {
  const pastEvents: VideoEvent[] = [
    {
      id: '1',
      title: 'Impactful Research and Scholarship (Part 1)',
      videoId: '4JttSPOHnLU',
      duration: '3:01:34'
    },
    {
      id: '2', 
      title: 'Entering the academic market and progressing on the job',
      videoId: '3m2pFRVPqd8',
      duration: '2:48:03'
    }
  ];

  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-medium text-foreground mb-4">
            Our Past Events
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch recordings from our previous conferences and events featuring expert discussions on academic careers and research
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {pastEvents.map((event) => (
            <Card key={event.id} className="card-hover overflow-hidden">
              <div className="relative group">
                <div className="aspect-video bg-black/10 dark:bg-white/10 flex items-center justify-center">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${event.videoId}`}
                    title={event.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="rounded-t-lg"
                  />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                  {event.duration}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  {event.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Society of Black Academics (SBA)
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">
            Want to see more content? Subscribe to our YouTube channel for the latest videos and event recordings.
          </p>
          <a 
            href="https://www.youtube.com/channel/UC2mDgBLZlUUjipwEHVZuy-w"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <Play className="h-4 w-4" />
            Visit our YouTube Channel
          </a>
        </div>
      </div>
    </section>
  );
};