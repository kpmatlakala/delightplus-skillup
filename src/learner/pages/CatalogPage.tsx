import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Compass,
  ArrowRight,
  BookOpen,
  Brain,
  Code,
  Shield,
  Cloud,
  Globe,
  Cpu,
  Smartphone,
} from "lucide-react";
import {
  dsaProgramCatalog,
  PROGRAM_CATEGORIES,
  type ProgramCategory,
} from "@/data/dsaProgramCatalog";
import { program } from "@/data/courseData";

const categoryIcon: Record<ProgramCategory, typeof Brain> = {
  "AI & Data Science": Brain,
  "Software Development": Code,
  "Cyber Security": Shield,
  "Cloud Computing": Cloud,
  "Emerging Technologies": Globe,
  "Drone & Hardware Tech": Cpu,
  "Telecommunications": Smartphone,
};

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState<ProgramCategory | "All">("All");
  const enrolledIds = new Set([program.saqaId]);
  const enrolled = dsaProgramCatalog.filter((c) => enrolledIds.has(c.saqaId ?? ""));
  const available = dsaProgramCatalog.filter((c) => !enrolledIds.has(c.saqaId ?? ""));

  const filtered =
    activeCategory === "All"
      ? available
      : available.filter((c) => c.category === activeCategory);

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
              Some units may be borrowed across related programmes.
            </p>
          </div>
        </div>
      </div>

      {/* Enrolled */}
      {enrolled.length > 0 && (
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
                <div className="mt-3 flex justify-end gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/learner/programs/${c.id}`}>View Info</Link>
                  </Button>
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
      )}

      {/* Category filter chips */}
      <section className="rounded-lg border border-border bg-card p-4 mb-4">
        <h2 className="font-display font-semibold mb-3 text-sm">Explore by category</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("All")}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              activeCategory === "All"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:bg-secondary/50"
            }`}
          >
            All ({available.length})
          </button>
          {PROGRAM_CATEGORIES.map((cat) => {
            const Icon = categoryIcon[cat];
            const count = available.filter((c) => c.category === cat).length;
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:bg-secondary/50"
                }`}
              >
                <Icon size={12} /> {cat} ({count})
              </button>
            );
          })}
        </div>
      </section>

      {/* Program grid */}
      <section className="rounded-lg border border-border bg-card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-sm">
            {activeCategory === "All" ? "All programmes" : activeCategory}
          </h2>
          <span className="text-[11px] text-muted-foreground">{filtered.length} found</span>
        </div>
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No programmes in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((c) => {
              const Icon = categoryIcon[c.category];
              return (
                <div key={c.id} className="rounded-md border border-border p-3 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="w-9 h-9 rounded-lg dsa-gradient-bg flex items-center justify-center text-white shrink-0">
                      <Icon size={16} />
                    </div>
                    <Badge
                      variant="secondary"
                      className={`shrink-0 text-[10px] ${c.status === "Active" ? "bg-success text-success-foreground" : ""}`}
                    >
                      {c.status === "Active" ? "Enrolling" : c.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground leading-snug">{c.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {c.type}
                    {c.saqaId ? ` · SAQA ${c.saqaId}` : ""}
                    {c.nqfLevel ? ` · NQF ${c.nqfLevel}` : ""}
                    {c.totalCredits ? ` · ${c.totalCredits} credits` : ""}
                  </p>
                  <div className="mt-3 pt-2 flex gap-2 mt-auto">
                    <Button asChild size="sm" variant="outline" className="flex-1 text-xs">
                      <Link to={`/learner/programs/${c.id}`}>View Info</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="flex-1 text-xs"
                      disabled={c.status !== "Active"}
                      variant={c.status === "Active" ? "default" : "secondary"}
                    >
                      {c.status === "Active" ? (
                        <Link to={`/learner/programs/${c.id}`}>Enroll</Link>
                      ) : (
                        <span>Coming soon</span>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
