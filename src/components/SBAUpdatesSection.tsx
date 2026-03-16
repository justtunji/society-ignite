import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Calendar, Eye, Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SBAUpdate {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
  year: number | null;
  topics: string[] | null;
}

const SBAUpdatesSection = () => {
  const [updates, setUpdates] = useState<SBAUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpdate, setSelectedUpdate] = useState<SBAUpdate | null>(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("resource_type", "sba-update")
        .order("published_at", { ascending: false });

      if (!error && data) {
        setUpdates(data);
      }
      setLoading(false);
    };
    fetchUpdates();
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="py-20 lg:py-28 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container-wide">
          <div className="text-center mb-12">
            <div className="h-6 w-32 bg-muted rounded-full mx-auto mb-4 animate-pulse" />
            <div className="h-10 w-64 bg-muted rounded mx-auto mb-3 animate-pulse" />
            <div className="h-5 w-96 bg-muted rounded mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (updates.length === 0) return null;

  return (
    <>
      <section className="py-20 lg:py-28 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container-wide">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-5">
              <Newspaper className="h-4 w-4" />
              Monthly Updates
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              SBA Updates
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay informed with our latest news, events, and initiatives
            </p>
          </div>

          {/* Updates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {updates.map((update) => (
              <Card
                key={update.id}
                className="group overflow-hidden border border-border/50 hover:border-accent/40 hover:shadow-xl transition-all duration-300"
              >
                {/* Thumbnail or gradient header */}
                {update.thumbnail_url ? (
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={update.thumbnail_url}
                      alt={update.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-accent text-accent-foreground text-xs">
                        {formatDate(update.published_at)}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-32 bg-gradient-to-br from-primary via-primary/90 to-accent/20 flex items-end p-5">
                    <div className="absolute top-4 right-4">
                      <Newspaper className="h-8 w-8 text-primary-foreground/20" />
                    </div>
                    <Badge className="bg-accent text-accent-foreground text-xs">
                      {formatDate(update.published_at)}
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                    {update.title}
                  </h3>

                  {update.topics && update.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {update.topics.slice(0, 3).map((topic, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="text-xs"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {update.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-5">
                      {update.description.replace(/<[^>]*>/g, "").slice(0, 120)}
                      ...
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      className="rounded-full flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => setSelectedUpdate(update)}
                    >
                      <Eye className="h-4 w-4 mr-1.5" />
                      Read Online
                    </Button>
                    {update.file_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        asChild
                      >
                        <a href={update.file_url} download>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Read Online Modal */}
      <Dialog
        open={!!selectedUpdate}
        onOpenChange={(open) => !open && setSelectedUpdate(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="sticky top-0 z-10 bg-background border-b px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-bold truncate">
                  {selectedUpdate?.title}
                </DialogTitle>
                {selectedUpdate?.published_at && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(selectedUpdate.published_at)}
                  </p>
                )}
              </div>
              {selectedUpdate?.file_url && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full flex-shrink-0"
                  asChild
                >
                  <a href={selectedUpdate.file_url} download>
                    <Download className="h-4 w-4 mr-1.5" />
                    Download
                  </a>
                </Button>
              )}
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-100px)]">
            <div className="px-6 py-6">
              {selectedUpdate?.description && (
                <div
                  className="prose prose-sm max-w-none
                    prose-headings:text-foreground prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-3
                    prose-h2:text-2xl prose-h2:border-b prose-h2:border-border/50 prose-h2:pb-2
                    prose-h3:text-xl prose-h3:text-accent
                    prose-p:text-foreground/80 prose-p:leading-relaxed
                    prose-li:text-foreground/80
                    prose-strong:text-foreground
                    prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{
                    __html: selectedUpdate.description,
                  }}
                />
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SBAUpdatesSection;
