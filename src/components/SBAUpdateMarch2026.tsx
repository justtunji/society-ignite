import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Calendar, MapPin, ExternalLink, Heart, Youtube, Linkedin, Twitter, Instagram, ArrowRight } from "lucide-react";

const SBAUpdateMarch2026 = () => {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <Badge className="bg-accent/10 text-accent border-accent/20 mb-4 text-xs uppercase tracking-widest">
          March 2026
        </Badge>
        <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
          SBA Update
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          The latest news, events, and initiatives from the Society of Black Academics
        </p>
        <div className="mt-6">
          <Button asChild variant="outline" className="rounded-full gap-2">
            <a href="/downloads/SBA_Update_March_2026.docx" download>
              <Download className="h-4 w-4" />
              Download Full Update
            </a>
          </Button>
        </div>
      </div>

      {/* 5th Annual Conference */}
      <section className="mb-16">
        <div className="border-l-4 border-accent pl-8 mb-8">
          <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Reflecting on Our 5th Annual Conference
          </h3>
          <p className="text-muted-foreground">King's College London, 2025</p>
        </div>

        <div className="bg-muted/30 rounded-2xl p-8 mb-8">
          <p className="text-foreground/90 leading-relaxed mb-6">
            In 2025, we celebrated our fifth anniversary with our Annual Conference at King's College London, themed{" "}
            <strong className="text-foreground">From Surviving to Thriving: Building Sustainable Wellbeing as Black Academics</strong>.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-6">
            The conference explored key areas essential for long-term success in academia:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {["Research with Reach", "Financial Flourishing", "Mental Health and Wellbeing", "A Career with Purpose"].map((theme) => (
              <div key={theme} className="flex items-center gap-3 bg-background rounded-xl p-4 border border-border/50">
                <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                <span className="font-medium text-foreground text-sm">{theme}</span>
              </div>
            ))}
          </div>
          <p className="text-foreground/80 leading-relaxed">
            We were honoured to welcome senior leaders from across the higher education sector, including university vice-chancellors, deputy vice-chancellors, academic leaders, and funders (Do It Now Now and the Nuffield Foundation).
          </p>
        </div>

        {/* Conference Sessions */}
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: "How Can Black Academics Move from Surviving to Thriving", speaker: "Professor Sally Everett" },
            { title: "Research with Reach", speaker: "Liz Gilfillan, Dr Anne Makena, Saskia Walcott", chair: "Dr Nero Ughwujabo" },
            { title: "Financial Flourishing", speaker: "Victor Olaseni, Debodun Osekita, Ken & Mary Okoroafor, Godfrey Asare", chair: "Professor Miranda Brawn" },
            { title: "Mental Health and Wellbeing", speaker: "Dr Tokunbo Fasuyi, Dr Lola Olamosu, Dr Peter Phiri, Jenny Okolo", chair: "Professor Jessica Jones Nielsen" },
            { title: "A Career with Purpose", speaker: "Professor David Mba, Alice Chilver, Professor Robert Mokaya", chair: "Dr Ashiedu Joel" },
          ].map((session, idx) => (
            <Card key={idx} className="border border-border/50 hover:border-accent/30 transition-colors">
              <CardContent className="p-5">
                <Badge variant="secondary" className="text-xs mb-3">Session {idx + 1}</Badge>
                <h4 className="font-semibold text-foreground mb-2 text-sm">{session.title}</h4>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Speaker{session.speaker.includes(",") ? "s" : ""}:</span> {session.speaker}
                </p>
                {session.chair && (
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="font-medium">Chair:</span> {session.chair}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
          <Youtube className="h-4 w-4" />
          <span>Watch previous conference recordings on our{" "}
            <a href="https://www.youtube.com/@societyofblackacademics" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 underline underline-offset-2">
              YouTube channel
            </a>
          </span>
        </div>
      </section>

      {/* 2026 Workshops */}
      <section className="mb-16">
        <div className="border-l-4 border-teal pl-8 mb-8">
          <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            2026 Workshop Series
          </h3>
          <p className="text-muted-foreground">In partnership with ITLSIG</p>
        </div>

        <p className="text-foreground/80 leading-relaxed mb-8">
          Building on the themes of thriving and sustainable careers, SBA has partnered with the International Teaching and Learning Special Interest Group (ITLSIG) to deliver a three-part workshop series between February and July 2026.
        </p>

        <div className="space-y-4">
          {[
            {
              num: 1,
              date: "27 February 2026",
              title: "Embracing AI Responsibly in Teaching and Learning Contexts",
              desc: "This session explored how Artificial Intelligence is reshaping teaching, learning, assessment, and academic work.",
              past: true,
            },
            {
              num: 2,
              date: "Wednesday, 20 May 2026",
              title: "Career Progression on the Teaching-Focused Pathway",
              desc: "This workshop will focus on building successful and impactful academic careers through teaching and scholarship pathways.",
              past: false,
            },
            {
              num: 3,
              date: "Wednesday, 22 July 2026",
              title: "Addressing the Degree Awarding Gap in Higher Education",
              desc: "This session will explore how Black academics can act as agents of change in tackling awarding gaps affecting Black and minoritized students.",
              past: false,
            },
          ].map((ws) => (
            <div key={ws.num} className={`rounded-xl p-6 border transition-all ${ws.past ? "bg-muted/20 border-border/30" : "bg-gradient-to-r from-teal/5 to-transparent border-teal/20 hover:border-teal/40"}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <Badge variant={ws.past ? "secondary" : "default"} className={ws.past ? "" : "bg-teal text-teal-foreground"}>
                      Workshop {ws.num}
                    </Badge>
                    {ws.past && <Badge variant="outline" className="text-xs">Completed</Badge>}
                  </div>
                  <h4 className="font-bold text-foreground mb-1">{ws.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {ws.date}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{ws.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mt-6 leading-relaxed">
          SBA is also working closely with the <strong>Chartered Association of Business Schools (CABS)</strong> on a tailored programme focused on commercialising academic research.
        </p>
      </section>

      {/* 6th Annual Conference */}
      <section className="mb-16">
        <Card className="overflow-hidden border-2 border-accent/30 bg-gradient-to-br from-accent/5 via-background to-accent/10">
          <CardContent className="p-8 lg:p-12">
            <Badge className="bg-accent text-accent-foreground mb-4">Save the Date</Badge>
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              SBA 6th Annual Conference
            </h3>
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-accent" />
                Tuesday, 15 September 2026
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-accent" />
                University of Bath
              </span>
            </div>
            <p className="text-foreground/80 leading-relaxed mb-6">
              The theme will focus on <strong>Demystifying Leadership in Higher Education</strong>, exploring how Black academics can navigate leadership pathways, build influence, and lead with impact. The conference will feature senior leaders, interactive breakout sessions, and discipline-specific mentoring opportunities.
            </p>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
              <a
                href="https://www.bath.ac.uk/events/society-of-black-academics-sixth-annual-conference-2026/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Register Now
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Research Impact */}
      <section className="mb-16">
        <div className="border-l-4 border-purple pl-8 mb-8">
          <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Research Impact & Sector Partnerships
          </h3>
        </div>
        <p className="text-foreground/80 leading-relaxed mb-4">
          SBA is proud to have co-authored the policy report: <strong>Unblocking the Pipeline: Supporting the Retention, Progression, and Promotion of Black Early Career Academics</strong>, in partnership with the Higher Education Policy Institute (HEPI) and GatenbySanderson.
        </p>
        <Button asChild variant="outline" size="sm" className="rounded-full">
          <a
            href="https://www.gatenbysanderson.com/news/report-supporting-the-retention-progression-and-promotion-of-black-early-career-academics/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read the Report
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </section>

      {/* Looking Ahead */}
      <section className="mb-16">
        <div className="border-l-4 border-indigo pl-8 mb-8">
          <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Looking Ahead
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: "SBA Goes Global",
              desc: "We are planning our first international conference in Europe, expanding SBA's reach to connect with scholars worldwide.",
              color: "border-indigo/30",
            },
            {
              title: "Black History Month Event",
              desc: "A special event themed "Reclaiming Narratives," exploring how connecting with historical roots can serve as a source of strength.",
              color: "border-coral/30",
            },
            {
              title: "SBA Regional Forums",
              desc: "Launching quarterly forums across the UK — London, North West, North East, Midlands, South East, South West, Scotland, and Northern Ireland.",
              color: "border-teal/30",
            },
          ].map((item, idx) => (
            <Card key={idx} className={`border-l-4 ${item.color} border-t-0 border-r-0 border-b-0`}>
              <CardContent className="p-6">
                <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Support / Donate */}
      <section className="mb-8">
        <Card className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground overflow-hidden">
          <CardContent className="p-8 lg:p-12 text-center">
            <Heart className="h-10 w-10 mx-auto mb-4 text-accent" />
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Support the Society of Black Academics
            </h3>
            <p className="text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto mb-8">
              Since its inception, SBA has remained committed to keeping all events, conferences, workshops, and membership free and accessible. As we continue to grow, your voluntary contributions help us sustain conferences, workshops, mentoring activities, and new programmes.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 py-6 text-lg"
            >
              <a
                href="https://www.paypal.com/donate/?hosted_button_id=LQGKBMZKMQHNE"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Heart className="mr-2 h-5 w-5" />
                Make a Donation
              </a>
            </Button>
            <p className="text-primary-foreground/60 text-sm mt-4">
              We are deeply grateful for any level of support.
            </p>
          </CardContent>
        </Card>
      </section>
    </article>
  );
};

export default SBAUpdateMarch2026;
