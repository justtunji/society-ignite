import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import conferenceFlyer from "@/assets/sba-2026-conference.jpeg.asset.json";
import { useSectionContent } from "@/hooks/useSectionContent";
import { cldUrl, cldSrcSet } from "@/lib/cloudinary";

const DEFAULTS = {
  eyebrow: 'Upcoming Event',
  headline: 'SBA 2026 Annual Conference',
  body: 'Join scholars, leaders, and practitioners from across the UK and beyond for our flagship annual conference. A space to connect, collaborate, and shape the future of inclusive higher education.',
  date_text: '2026 — dates to be announced',
  location_text: 'United Kingdom',
  badge_label: 'Save the date',
  badge_value: '2026',
  image_url: '',
  primary_cta_label: 'Support Us & Attend Free',
  primary_cta_url: '/join-us',
  secondary_cta_label: 'Get Updates',
  secondary_cta_url: '/contact',
};

export const ConferenceSection = () => {
  const c = useSectionContent('home', 'conference', DEFAULTS);
  if (!c) return null;

  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            {(() => {
              const src = c.image_url || conferenceFlyer.url;
              return (
                <div className="w-full aspect-square rounded-2xl shadow-xl bg-muted border border-border/40 overflow-hidden">
                  <img
                    src={cldUrl(src, { w: 1200, c: 'fit' })}
                    srcSet={cldSrcSet(src, [600, 1200, 1600], { c: 'fit' })}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    alt={c.headline}
                    loading="eager"
                    decoding="async"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = conferenceFlyer.url; }}
                    className="w-full h-full object-contain bg-background"
                  />
                </div>
              );
            })()}
            {(c.badge_label || c.badge_value) && (
              <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground rounded-2xl px-6 py-4 shadow-lg hidden md:block">
                {c.badge_label && <p className="text-sm font-semibold uppercase tracking-wider">{c.badge_label}</p>}
                {c.badge_value && <p className="text-2xl font-bold">{c.badge_value}</p>}
              </div>
            )}
          </div>

          <div>
            {c.eyebrow && (
              <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">{c.eyebrow}</p>
            )}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {c.headline}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">{c.body}</p>

            <div className="space-y-3 mb-8">
              {c.date_text && (
                <div className="flex items-center gap-3 text-foreground">
                  <Calendar className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>{c.date_text}</span>
                </div>
              )}
              {c.location_text && (
                <div className="flex items-center gap-3 text-foreground">
                  <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>{c.location_text}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {c.primary_cta_label && (
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8">
                  <a href={c.primary_cta_url || '#'}>
                    {c.primary_cta_label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
              {c.secondary_cta_label && (
                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                  <a href={c.secondary_cta_url || '#'}>{c.secondary_cta_label}</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
