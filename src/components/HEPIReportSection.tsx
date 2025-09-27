import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, FileText } from "lucide-react";

export const HEPIReportSection = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight text-foreground mb-4">
            Latest Research & Impact
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our collaborative work addressing the challenges facing Black academics in UK Higher Education
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Report Feature */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-2 border-primary/20 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 h-full">
                  <div className="relative">
                    <img 
                      src="https://societyofblackacademics.com/wp-content/uploads/2024/08/Unblocking-the-Pipeline-SM-3-1024x1024.png"
                      alt="Unblocking the Pipeline Report Cover"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-primary">Research Report</span>
                    </div>
                    <h3 className="text-2xl font-medium text-foreground mb-4">
                      Unblocking the Pipeline
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Supporting the Retention, Progression and Promotion of Black Early-Career Academics. 
                      A collaborative report with Advance HE, GatenbySanderson, and Higher Education Policy Institute.
                    </p>
                    <Button asChild variant="outline" className="group w-fit">
                      <a 
                        href="https://www.gatenbysanderson.com/news/report-supporting-the-retention-progression-and-promotion-of-black-early-career-academics/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Read Full Report
                        <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Content */}
          <div className="space-y-6">
            <Card className="border border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <h4 className="font-medium text-foreground mb-3">
                  Developing a Successful Career as a Black Academic in the UK
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Black academics are underrepresented at professorial and leadership levels in UK Universities...
                </p>
                <Button asChild variant="link" size="sm" className="p-0 h-auto">
                  <a 
                    href="https://www.sbia.business-school.ed.ac.uk/news/developing-a-successful-career-as-a-black-academic-in-the-uk"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read More
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <h4 className="font-medium text-foreground mb-3">
                  Impactful Research and Scholarship
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A short piece on Impactful Research and Scholarship from our last conference.
                </p>
                <Button asChild variant="link" size="sm" className="p-0 h-auto">
                  <a 
                    href="https://www.linkedin.com/feed/update/urn:li:activity:6969935472240271360/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read More
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <div className="text-center pt-4">
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <a href="/resources">
                  View All Resources
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};