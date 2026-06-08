import sbaImage from "@/assets/images/gallery/sba-10-1.jpeg";
import { useSectionContent } from "@/hooks/useSectionContent";

const DEFAULTS = {
  eyebrow: 'Our impact',
  intro: 'The Society of Black Academics was founded in 2020. Since then, we have worked with some of the most influential institutions in UK higher education to support the success of Black academics.',
  stat_1_number: '800+',
  stat_1_label: 'Black academics supported through our conferences, workshops, and mentorship programmes.',
  stat_2_number: '15',
  stat_2_label: 'UK universities and institutions partnered with to advance diversity in higher education.',
  stat_3_number: '1000+',
  stat_3_label: 'Networking opportunities provided to community members across the UK and beyond.',
  image_url: '',
};

export const ImpactSection = () => {
  const c = useSectionContent('home', 'impact', DEFAULTS);
  if (!c) return null;

  const stats = [
    { number: c.stat_1_number, label: c.stat_1_label },
    { number: c.stat_2_number, label: c.stat_2_label },
    { number: c.stat_3_number, label: c.stat_3_label },
  ].filter(s => s.number || s.label);

  return (
    <section className="py-20 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={c.image_url || sbaImage}
          alt="SBA Impact"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-primary/90"></div>
      </div>

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            {c.eyebrow && (
              <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">{c.eyebrow}</h4>
            )}
            <p className="text-lg text-primary-foreground/80 leading-relaxed">{c.intro}</p>
          </div>

          <div className="space-y-12">
            {stats.map((stat, index) => (
              <div key={index} className="border-b border-primary-foreground/20 pb-8 last:border-0">
                <h2 className="text-5xl lg:text-6xl font-bold text-accent mb-4">{stat.number}</h2>
                <p className="text-primary-foreground/80 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
