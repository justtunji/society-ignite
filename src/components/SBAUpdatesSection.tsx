import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Calendar, Eye, Newspaper, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SBAUpdate {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
  year: number | null;
  topics: string[] | null;
  featured: boolean | null;
}

const ALL_YEARS = "all-years";
const ALL_MONTHS = "all-months";

const MONTH_OPTIONS = [
  { value: "0", label: "January" },
  { value: "1", label: "February" },
  { value: "2", label: "March" },
  { value: "3", label: "April" },
  { value: "4", label: "May" },
  { value: "5", label: "June" },
  { value: "6", label: "July" },
  { value: "7", label: "August" },
  { value: "8", label: "September" },
  { value: "9", label: "October" },
  { value: "10", label: "November" },
  { value: "11", label: "December" },
];

const MARCH_2026_FALLBACK: SBAUpdate = {
  id: "march-2026-fallback",
  title: "SBA Update — March 2026",
  description: `<h2>Reflecting on Our 5th Annual Conference</h2>
<p>In 2025, we celebrated our fifth anniversary with our Annual Conference at King's College London, themed <strong>From Surviving to Thriving: Building Sustainable Wellbeing as Black Academics</strong>.</p>
<p>The conference explored key areas essential for long-term success in academia:</p>
<ul><li>Research with Reach</li><li>Financial Flourishing</li><li>Mental Health and Wellbeing</li><li>A Career with Purpose</li></ul>
<p>We were honoured to welcome senior leaders from across the higher education sector, including university vice-chancellors, deputy vice-chancellors, academic leaders, and funders (Do It Now Now and the Nuffield Foundation).</p>
<h3>Conference Sessions</h3>
<p><strong>Session 1:</strong> How Can Black Academics Move from Surviving to Thriving — Professor Sally Everett</p>
<p><strong>Session 2:</strong> Research with Reach — Liz Gilfillan, Dr Anne Makena, Saskia Walcott (Chair: Dr Nero Ughwujabo)</p>
<p><strong>Session 3:</strong> Financial Flourishing — Victor Olaseni, Debodun Osekita, Ken &amp; Mary Okoroafor, Godfrey Asare (Chair: Professor Miranda Brawn)</p>
<p><strong>Session 4:</strong> Mental Health and Wellbeing — Dr Tokunbo Fasuyi, Dr Lola Olamosu, Dr Peter Phiri, Jenny Okolo (Chair: Professor Jessica Jones Nielsen)</p>
<p><strong>Session 5:</strong> A Career with Purpose — Professor David Mba, Alice Chilver, Professor Robert Mokaya (Chair: Dr Ashiedu Joel)</p>
<h2>2026 Workshop Series</h2>
<p>Building on the themes of thriving and sustainable careers, SBA has partnered with the International Teaching and Learning Special Interest Group (ITLSIG) to deliver a three-part workshop series between February and July 2026.</p>
<h3>Workshop 1 — 27 February 2026 (Completed)</h3>
<p><strong>Embracing AI Responsibly in Teaching and Learning Contexts: Opportunities and Challenges</strong></p>
<p>This session explored how Artificial Intelligence is reshaping teaching, learning, assessment, and academic work.</p>
<h3>Workshop 2 — Wednesday, 20 May 2026</h3>
<p><strong>Career Progression on the Teaching-Focused Pathway</strong></p>
<p>This workshop will focus on building successful and impactful academic careers through teaching and scholarship pathways.</p>
<h3>Workshop 3 — Wednesday, 22 July 2026</h3>
<p><strong>Addressing the Degree Awarding Gap in Higher Education</strong></p>
<p>This session will explore how Black academics can act as agents of change in tackling awarding gaps affecting Black and minoritized students.</p>
<h2>Save the Date: SBA 6th Annual Conference</h2>
<p><strong>Tuesday, 15 September 2026 — University of Bath</strong></p>
<p>The theme will focus on <strong>Demystifying Leadership in Higher Education</strong>, exploring how Black academics can navigate leadership pathways, build influence, and lead with impact.</p>
<p><a href="https://www.bath.ac.uk/events/society-of-black-academics-sixth-annual-conference-2026/" target="_blank">Register Here</a></p>
<h2>Research Impact &amp; Sector Partnerships</h2>
<p>SBA is proud to have co-authored the policy report: <strong>Unblocking the Pipeline: Supporting the Retention, Progression, and Promotion of Black Early Career Academics</strong>, in partnership with the Higher Education Policy Institute (HEPI) and GatenbySanderson.</p>
<p><a href="https://www.gatenbysanderson.com/news/report-supporting-the-retention-progression-and-promotion-of-black-early-career-academics/" target="_blank">Read the Report</a></p>
<h2>Looking Beyond the UK: SBA Goes Global</h2>
<p>We are planning our first international conference in Europe. The issues SBA addresses reflect global challenges experienced by Black academics across higher education systems worldwide.</p>
<h2>Black History Month Event — October 2026</h2>
<p>A special event themed "Reclaiming Narratives," exploring how connecting with historical roots and identity can serve as a source of strength for academic and professional growth.</p>
<h2>New Initiative: SBA Regional Forums</h2>
<p>In 2026, we are launching SBA Regional Forums across the UK, including London, the North West, North East, Midlands, South East, South West, Scotland, and Northern Ireland.</p>
<h2>Supporting the Society of Black Academics</h2>
<p>Since its inception, SBA has remained committed to keeping all events, conferences, workshops, and membership free and accessible. As SBA continues to grow, we are offering members the opportunity to support the Society through voluntary financial contributions.</p>
<p><a href="https://www.paypal.com/donate/?hosted_button_id=LQGKBMZKMQHNE" target="_blank"><strong>💛 Make a Donation</strong></a></p>
<p>We are deeply grateful for any level of support and for your continued belief in SBA's mission.</p>`,
  file_url: "/downloads/SBA_Update_March_2026.docx",
  thumbnail_url: null,
  published_at: "2026-03-01T00:00:00Z",
  year: 2026,
  topics: ["Conference", "Workshops", "Leadership", "Research"],
  featured: true,
};

const getUpdateYear = (update: SBAUpdate) => {
  if (update.year) return update.year;
  if (!update.published_at) return null;
  return new Date(update.published_at).getFullYear();
};

const getUpdateMonth = (update: SBAUpdate) => {
  if (!update.published_at) return null;
  return new Date(update.published_at).getMonth();
};

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

const SBAUpdatesSection = () => {
  const [updates, setUpdates] = useState<SBAUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpdate, setSelectedUpdate] = useState<SBAUpdate | null>(null);
  const [selectedYear, setSelectedYear] = useState(ALL_YEARS);
  const [selectedMonth, setSelectedMonth] = useState(ALL_MONTHS);

  useEffect(() => {
    const fetchUpdates = async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("resource_type", "sba-update")
        .order("published_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setUpdates(data);
      } else {
        setUpdates([MARCH_2026_FALLBACK]);
      }
      setLoading(false);
    };
    fetchUpdates();
  }, []);

  const yearOptions = useMemo(() => {
    const years = Array.from(
      new Set(updates.map(getUpdateYear).filter((year): year is number => year !== null))
    ).sort((a, b) => b - a);

    return years.map((year) => ({ value: String(year), label: String(year) }));
  }, [updates]);

  const monthOptions = useMemo(() => {
    const filteredByYear = selectedYear === ALL_YEARS
      ? updates
      : updates.filter((update) => String(getUpdateYear(update)) === selectedYear);

    const months = new Set(
      filteredByYear
        .map(getUpdateMonth)
        .filter((month): month is number => month !== null)
    );

    return MONTH_OPTIONS.filter((month) => months.has(Number(month.value)));
  }, [updates, selectedYear]);

  const filteredUpdates = useMemo(() => {
    const filtered = updates.filter((update) => {
      const matchesYear = selectedYear === ALL_YEARS || String(getUpdateYear(update)) === selectedYear;
      const matchesMonth = selectedMonth === ALL_MONTHS || String(getUpdateMonth(update)) === selectedMonth;
      return matchesYear && matchesMonth;
    });
    // Pin featured updates to top
    return filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [updates, selectedMonth, selectedYear]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
  };

  const resetFilters = () => {
    setSelectedYear(ALL_YEARS);
    setSelectedMonth(ALL_MONTHS);
  };

  if (loading) {
    return (
      <section className="py-20 lg:py-28 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container-wide">
          <div className="text-center mb-12">
            <div className="h-6 w-32 bg-muted rounded-full mx-auto mb-4 animate-pulse" />
            <div className="h-10 w-64 bg-muted rounded mx-auto mb-3 animate-pulse" />
            <div className="h-5 w-96 bg-muted rounded mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (updates.length === 0) return null;

  return (
    <>
      <section className="py-20 lg:py-28 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container-wide">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-5">
              <Newspaper className="h-4 w-4" />
              Monthly Updates
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              SBA Updates
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay informed with our latest news, events, and initiatives
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-border/60 bg-card/80 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Filter className="h-4 w-4 text-accent" />
                  Browse the archive
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Filter SBA Updates by year and month.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Select
                  value={selectedYear}
                  onValueChange={(value) => {
                    setSelectedYear(value);
                    setSelectedMonth(ALL_MONTHS);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_YEARS}>All years</SelectItem>
                    {yearOptions.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_MONTHS}>All months</SelectItem>
                    {monthOptions.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {filteredUpdates.length === 0 ? (
            <Card className="border border-border/60 bg-card/80">
              <CardContent className="py-12 text-center">
                <p className="text-lg font-semibold text-foreground">No updates found</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try a different year or month to browse the archive.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUpdates.map((update) => (
                <Card
                  key={update.id}
                  className="group overflow-hidden border border-border/50 hover:border-accent/40 hover:shadow-xl transition-all duration-300"
                >
                  {update.thumbnail_url ? (
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={update.thumbnail_url}
                        alt={update.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-accent text-accent-foreground text-xs">
                          {formatDate(update.published_at)}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-32 bg-gradient-to-br from-primary via-primary/90 to-accent/20 flex items-end p-5">
                      <div className="absolute top-4 right-4">
                        <Newspaper className="h-8 w-8 text-primary-foreground/20" />
                      </div>
                      <Badge className="bg-accent text-accent-foreground text-xs">
                        {formatDate(update.published_at)}
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-lg text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                        {update.title}
                      </h3>
                      {update.featured && (
                        <Badge className="bg-accent text-accent-foreground text-xs flex-shrink-0">Pinned</Badge>
                      )}
                    </div>

                    {update.topics && update.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {update.topics.slice(0, 3).map((topic, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {update.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-5">
                        {stripHtml(update.description).slice(0, 120)}...
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="accent"
                        className="rounded-full flex-1"
                        onClick={() => setSelectedUpdate(update)}
                      >
                        <Eye className="h-4 w-4 mr-1.5" />
                        Read Online
                      </Button>
                      {update.file_url && (
                        <Button size="sm" variant="outline" className="rounded-full" asChild>
                          <a href={update.file_url} download>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selectedUpdate} onOpenChange={(open) => !open && setSelectedUpdate(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="sticky top-0 z-10 bg-background border-b px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-bold truncate">
                  {selectedUpdate?.title}
                </DialogTitle>
                {selectedUpdate?.published_at && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(selectedUpdate.published_at)}
                  </p>
                )}
              </div>
              {selectedUpdate?.file_url && (
                <Button size="sm" variant="outline" className="rounded-full flex-shrink-0" asChild>
                  <a href={selectedUpdate.file_url} download>
                    <Download className="h-4 w-4 mr-1.5" />
                    Download
                  </a>
                </Button>
              )}
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-100px)]">
            <div className="px-6 py-6">
              {selectedUpdate?.description && (
                <div
                  className="prose prose-sm max-w-none
                    prose-headings:text-foreground prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-3
                    prose-h2:text-2xl prose-h2:border-b prose-h2:border-border/50 prose-h2:pb-2
                    prose-h3:text-xl prose-h3:text-accent
                    prose-p:text-foreground/80 prose-p:leading-relaxed
                    prose-li:text-foreground/80
                    prose-strong:text-foreground
                    prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{
                    __html: selectedUpdate.description,
                  }}
                />
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SBAUpdatesSection;