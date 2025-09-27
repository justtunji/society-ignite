import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { PartnerSponsorDialog } from "./PartnerSponsorDialog";
import nuffieldLogo from "@/assets/logos/nuffield-logo.png";

export const NuffieldAnnouncement = () => {
  return (
    <section className="section-padding bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
      <div className="container-wide">
        <Card className="bg-white/90 dark:bg-card/90 backdrop-blur-sm border-green-200 dark:border-green-800 hover-lift animate-fade-in">
          <CardContent className="p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="animate-slide-in-left">
                <img 
                  src={nuffieldLogo}
                  alt="Nuffield Foundation Logo"
                  className="h-48 mb-6 hover-lift transition-transform duration-300"
                />
              </div>
              <div className="space-y-6 animate-slide-in-right">
                <h2 className="text-2xl lg:text-3xl font-medium text-foreground">
                  Partnership Announcement
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We're delighted to announce that the <strong>Nuffield Foundation</strong> will support the{" "}
                    <a 
                      href="https://www.linkedin.com/feed/update/urn:li:activity:7284973224881217536"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      2025 Society of Black Academics (SBA) Conference
                    </a>!
                  </p>
                  <p>
                    With a long history of funding research and driving change on the UK's biggest social challenges, 
                    Nuffield's commitment to fairness and opportunity strongly aligns with SBA's mission to build 
                    community and amplify the voice of Black academics and aspiring scholars.
                  </p>
                </div>
                <Button asChild variant="outline" className="group hover-lift">
                  <a 
                    href="https://www.nuffieldfoundation.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn More
                    <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-8 animate-scale-in">
          <PartnerSponsorDialog>
            <Button size="lg" variant="outline" className="hover-lift animate-pulse-glow">
              Become a Partner & Sponsor
            </Button>
          </PartnerSponsorDialog>
        </div>
      </div>
    </section>
  );
};