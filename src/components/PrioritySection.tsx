import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Users, BookOpen, Target, Globe } from "lucide-react";

const priorities = [
  {
    icon: Users,
    title: "Community Building",
    description: "Fostering connections and collaboration among Black academics and aspiring scholars."
  },
  {
    icon: BookOpen,
    title: "Research Excellence",
    description: "Supporting innovative research that drives positive change in higher education."
  },
  {
    icon: Target,
    title: "Career Development",
    description: "Providing mentorship and resources to advance academic careers."
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "Creating inclusive educational environments worldwide."
  }
];

export const PrioritySection = () => {
  return (
    <section className="section-padding bg-secondary/50">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">Our Priorities</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We focus on building a supportive ecosystem that empowers Black academics to thrive and lead in higher education.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {priorities.map((priority) => (
            <Card key={priority.title} className="group hover:shadow-large transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <priority.icon className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-xl">{priority.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">{priority.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};