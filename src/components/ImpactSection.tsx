import sbaImage from "@/assets/images/gallery/sba-10-1.jpeg";

interface ImpactStat {
  number: string;
  label: string;
}

export const ImpactSection = () => {
  const stats: ImpactStat[] = [
    {
      number: '800+',
      label: 'Black academics supported through our conferences, workshops, and mentorship programmes.'
    },
    {
      number: '15',
      label: 'UK universities and institutions partnered with to advance diversity in higher education.'
    },
    {
      number: '1000+',
      label: 'Networking opportunities provided to community members across the UK and beyond.'
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={sbaImage}
          alt="SBA Impact"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-primary/90"></div>
      </div>
      
      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - Header */}
          <div>
            <h4 className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Our impact
            </h4>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              The Society of Black Academics was founded in 2020. Since then, we have worked with some of the most influential institutions in UK higher education to support the success of Black academics.
            </p>
          </div>
          
          {/* Right - Stats */}
          <div className="space-y-12">
            {stats.map((stat, index) => (
              <div key={index} className="border-b border-primary-foreground/20 pb-8 last:border-0">
                <h2 className="text-5xl lg:text-6xl font-bold text-accent mb-4">
                  {stat.number}
                </h2>
                <p className="text-primary-foreground/80 text-lg">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
