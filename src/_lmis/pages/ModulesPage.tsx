import LmisLayout from "@/_lmis/components/LmisLayout";
import ModuleCard from "@/components/ModuleCard";
import { modules } from "@/data/courseData";
import { useState, useMemo } from "react";

export default function ModulesPage() {
  const [filter, setFilter] = useState<"All" | "Knowledge" | "Practical">("All");
  const [blockFilter, setBlockFilter] = useState<number | null>(null);

  // Build a stable order-number map from the full sorted array
  const orderMap = useMemo(() => {
    const map = new Map<string, number>();
    modules.forEach((m, i) => map.set(m.id, i + 1));
    return map;
  }, []);

  const filtered = modules.filter((m) => {
    if (filter !== "All" && m.type !== filter) return false;
    if (blockFilter !== null && m.block !== blockFilter) return false;
    return true;
  });

  return (
    <LmisLayout title="Modules" subtitle="10 Unit Standards • 56 Credits">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["All", "Knowledge", "Practical"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="w-px bg-border mx-1" />
        {[null, 1, 2, 3].map((b) => (
          <button
            key={b ?? "all"}
            onClick={() => setBlockFilter(b)}
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
              blockFilter === b
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            {b === null ? "All Blocks" : `Block ${b}`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((mod) => (
          <ModuleCard key={mod.id} module={mod} orderNumber={orderMap.get(mod.id)} />
        ))}
      </div>
    </LmisLayout>
  );
}
