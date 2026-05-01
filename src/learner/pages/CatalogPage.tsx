import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Compass, Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { dsaProgramCatalog } from "@/data/dsaProgramCatalog";
import { program } from "@/data/courseData";

export default function CatalogPage() {
  const enrolledIds = new Set([program.saqaId]);
  const enrolled = dsaProgramCatalog.filter((c) => enrolledIds.has(c.saqaId ?? ""));
  const available = dsaProgramCatalog.filter((c) => !enrolledIds.has(c.saqaId ?? ""));

  // Group by category
  const byCategory = available.reduce<Record<string, typeof available>>((acc, c) => {
    (acc[c.category] ??= []).push(c);
    return acc;
  }, {});

  return (
    <>
      <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 mb-4">
        <div className="flex items-start gap-3">
          <Compass className="text-accent mt-0.5" size={20} />
          <div>
            <h1 className="font-display font-bold text-foreground text-base sm:text-lg">
              Program Catalog
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Browse all qualifications, occupational certificates and short courses offered by The Data Science Academy.
            </p>
          </div>
        </div>
      </div>

      {/* Enrolled */}
      <section className="rounded-lg border border-border bg-card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <BookOpen size={16} className="text-accent" /> Your enrollments
          </h2>
          <span className="text-[11px] text-muted-foreground">{enrolled.length} active</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {enrolled.map((c) => (
            <div key={c.id} className="rounded-md border border-border p-3 hover:bg-secondary/40 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-snug">{c.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {c.saqaId ? `SAQA ${c.saqaId} • ` : ""}{c.nqfLevel ? `NQF ${c.nqfLevel} • ` : ""}{c.totalCredits ? `${c.totalCredits} credits` : ""}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0">Active</Badge>
              </div>
              <div className="mt-3 flex justify-end">
                <Button asChild size="sm" variant="default">
                  <Link to="/learner/modules">
                    Open <ArrowRight size={12} className="ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Available by category */}
      {Object.entries(byCategory).map(([category, courses]) => (
        <section key={category} className="rounded-lg border border-border bg-card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold flex items-center gap-2">
              <Sparkles size={16} className="text-accent" /> {category}
            </h2>
            <span className="text-[11px] text-muted-foreground">{courses.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {courses.map((c) => (
              <div key={c.id} className="rounded-md border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground leading-snug">{c.title}</p>
                  <Badge variant="secondary" className="shrink-0 text-[10px]">{c.status}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {c.type}{c.nqfLevel ? ` • NQF ${c.nqfLevel}` : ""}{c.totalCredits ? ` • ${c.totalCredits} credits` : ""}
                </p>
                <div className="mt-3 flex justify-end">
                  <Button size="sm" variant="outline" disabled>
                    Coming soon
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
