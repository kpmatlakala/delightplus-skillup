import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Brain,
  Code,
  Shield,
  Cloud,
  Globe,
  Cpu,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  dsaProgramCatalog,
  SLUG_TO_CATEGORY,
  CATEGORY_SLUGS,
  CATEGORY_BLURB,
  PROGRAM_CATEGORIES,
  type ProgramCategory,
} from "@/data/dsaProgramCatalog";

const categoryIcon: Record<ProgramCategory, typeof Brain> = {
  "AI & Data Science": Brain,
  "Software Development": Code,
  "Cyber Security": Shield,
  "Cloud Computing": Cloud,
  "Emerging Technologies": Globe,
  "Drone & Hardware Tech": Cpu,
  "Telecommunications": Smartphone,
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? SLUG_TO_CATEGORY[slug] : undefined;

  if (!category) return <Navigate to="/" replace />;

  const Icon = categoryIcon[category];
  const programs = dsaProgramCatalog.filter((p) => p.category === category);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative dsa-gradient-bg text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "55px 55px",
        }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
              <Icon className="h-7 w-7" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-accent">Category</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold leading-tight">{category}</h1>
          <p className="mt-4 max-w-2xl text-white/85 text-base sm:text-lg">{CATEGORY_BLURB[category]}</p>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold">Programmes in this track</h2>
            <p className="text-sm text-muted-foreground mt-1">{programs.length} programme{programs.length === 1 ? "" : "s"}</p>
          </div>
        </div>

        {programs.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card/50">
            <Icon className="h-10 w-10 mx-auto text-muted-foreground/60 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              New {category} programmes coming soon. Apply now to be notified when intake opens.
            </p>
            <Button asChild className="bg-gradient-to-r from-accent to-primary">
              <Link to="/auth/signup">Notify me</Link>
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {programs.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-5 shadow-md hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl dsa-gradient-bg flex items-center justify-center text-white shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge
                    variant={p.status === "Active" ? "default" : "secondary"}
                    className={p.status === "Active" ? "bg-success text-success-foreground" : ""}
                  >
                    {p.status === "Active" ? "Enrolling" : p.status}
                  </Badge>
                </div>
                <h3 className="font-display text-base font-bold leading-snug mb-1">{p.title}</h3>
                <p className="text-[11px] text-muted-foreground mb-3">
                  {p.type}
                  {p.saqaId ? ` · SAQA ${p.saqaId}` : ""}
                  {p.nqfLevel ? ` · NQF ${p.nqfLevel}` : ""}
                  {p.totalCredits ? ` · ${p.totalCredits} credits` : ""}
                </p>
                <div className="mt-auto pt-3 flex gap-2">
                  <Button asChild size="sm" className="flex-1 bg-gradient-to-r from-accent to-primary">
                    <Link to="/auth/signup">
                      Apply Now <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <Link to={`/auth/login?redirect=/learner/programs/${p.id}`}>View Info</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Other categories */}
      <section className="py-12 bg-card/40 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-display text-lg font-bold mb-5">Explore other tracks</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PROGRAM_CATEGORIES.filter((c) => c !== category).map((c) => {
              const CIcon = categoryIcon[c];
              return (
                <Link
                  key={c}
                  to={`/category/${CATEGORY_SLUGS[c]}`}
                  className="flex flex-col items-center text-center gap-2 p-4 rounded-xl border border-border bg-card hover:-translate-y-1 hover:shadow-md transition-all"
                >
                  <CIcon className="h-6 w-6 text-accent" />
                  <span className="text-xs font-medium">{c}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
