import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import sbaImage from "@/assets/images/gallery/sba-event-3.jpeg";

export const ConferenceSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src={sbaImage}
              alt="SBA 2026 Annual Conference"
              className="w-full h-auto rounded-2xl shadow-xl object-cover aspect-[4/3]"
            />
            <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground rounded-2xl px-6 py-4 shadow-lg hidden md:block">
              <p className="text-sm font-semibold uppercase tracking-wider">Save the date</p>
              <p className="text-2xl font-bold">2026</p>
            </div>
          </div>

          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Upcoming Event
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              SBA 2026 Annual Conference
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Join scholars, leaders, and practitioners from across the UK and beyond for our flagship annual conference. A space to connect, collaborate, and shape the future of inclusive higher education.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-foreground">
                <Calendar className="h-5 w-5 text-accent flex-shrink-0" />
                <span>2026 — dates to be announced</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                <span>United Kingdom</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8"
              >
                <a href="/join-us">
                  Support Us & Attend Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8"
              >
                <a href="/contact">Get Updates</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
