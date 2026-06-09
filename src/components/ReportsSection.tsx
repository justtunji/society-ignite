import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import hepiReportCover from "@/assets/images/hepi-report-cover.png";

interface Report {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
}

export const ReportsSection = () => {
  const reports: Report[] = [
    {
      id: '1',
      title: 'Unblocking the Pipeline',
      subtitle: 'Latest report',
      description: 'Supporting the Retention, Progression and Promotion of Black Early-Career Academics. A collaborative report with Advance HE and Higher Education Policy Institute.',
      image: hepiReportCover,
      link: 'https://www.gatenbysanderson.com/news/report-supporting-the-retention-progression-and-promotion-of-black-early-career-academics/'
    }
  ];

  return (
    <section data-section="reports" className="py-20 lg:py-32 bg-background">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-0 items-stretch">
          {/* Left - Dark Section with Content */}
          <div className="bg-primary text-primary-foreground p-8 lg:p-16 flex flex-col justify-center min-h-[400px]">
            <p className="text-accent font-medium text-sm uppercase tracking-wider mb-4">
              {reports[0].subtitle}
            </p>
            <h3 className="text-3xl lg:text-4xl font-bold mb-6">
              {reports[0].title}
            </h3>
            <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8 italic">
              {reports[0].description}
            </p>
            <Button 
              asChild 
              variant="outline"
              size="lg"
              className="w-fit border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary rounded-full px-8"
            >
              <a 
                href={reports[0].link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Access report
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
          
          {/* Right - Image */}
          <div className="relative min-h-[400px] lg:min-h-full bg-muted flex items-center justify-center p-8">
            <img 
              src={reports[0].image}
              alt={reports[0].title}
              className="max-h-[400px] w-auto object-contain shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
