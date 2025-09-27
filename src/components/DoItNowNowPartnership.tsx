import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { PartnerSponsorDialog } from "./PartnerSponsorDialog";

export const DoItNowNowPartnership = () => {
  return (
    <section className="section-padding bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-900/20">
      <div className="container-wide">
        <Card className="bg-white/90 dark:bg-card/90 backdrop-blur-sm border-blue-200 dark:border-blue-800 rounded-3xl overflow-hidden">
          <CardContent className="p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-br from-primary to-blue-600 p-3 rounded-2xl">
                    <img 
                      src="https://societyofblackacademics.com/wp-content/uploads/2025/09/DINN-e1757661440414-150x150.png"
                      alt="Do It Now Now Logo"
                      className="h-12 w-12 object-contain filter brightness-0 invert"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-medium text-foreground">
                      Conference Sponsor 2025
                    </h2>
                    <p className="text-primary font-medium">Do It Now Now Partnership</p>
                  </div>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We are honoured to have{" "}
                    <a 
                      href="https://www.doitnownow.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      Do It Now Now
                    </a>{" "}
                    among the sponsors for the{" "}
                    <a 
                      href="https://www.linkedin.com/feed/update/urn:li:activity:7284973224881217536"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      2025 Society of Black Academics Conference
                    </a>!
                  </p>
                  <p>
                    As a pioneering organisation committed to <em>empowering Black communities</em> through 
                    social mobility, financial inclusion, entrepreneurship, and authentic opportunity creation, 
                    Do It Now Now's values closely mirror SBA's mission: building networks, lifting voices, 
                    and creating space for Black academics and aspiring scholars to thrive.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button asChild variant="outline" className="group">
                    <a 
                      href="https://www.doitnownow.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn More About DINN
                      <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                  <PartnerSponsorDialog>
                    <Button variant="default">
                      Become a Sponsor
                    </Button>
                  </PartnerSponsorDialog>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-3xl rotate-3"></div>
                  <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 text-white">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <img 
                          src="https://societyofblackacademics.com/wp-content/uploads/2025/09/DINN-e1757661440414-150x150.png"
                          alt="Do It Now Now Logo"
                          className="h-16 w-16 object-contain filter brightness-0 invert"
                        />
                      </div>
                      <h3 className="text-xl font-medium">Empowering Black Communities</h3>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        Social mobility • Financial inclusion • Entrepreneurship • Authentic opportunity creation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};