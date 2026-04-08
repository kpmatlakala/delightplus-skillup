import LmisLayout from "@/lmis/components/LmisLayout";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const complianceItems = [
  { id: "1", category: "SAQA Alignment", label: "Program registered on NQF (SAQA 78965)", checked: true },
  { id: "2", category: "SAQA Alignment", label: "All 10 unit standards mapped to modules", checked: true },
  { id: "3", category: "SAQA Alignment", label: "Credits total verified (56 of 165)", checked: true },
  { id: "4", category: "ETQA Readiness", label: "Lesson plans follow LMIS template format", checked: true },
  { id: "5", category: "ETQA Readiness", label: "Assessment criteria aligned to SOs", checked: true },
  { id: "6", category: "ETQA Readiness", label: "PoE structure prepared (5 folders)", checked: false },
  { id: "7", category: "ETQA Readiness", label: "Moderation submission cover letter drafted", checked: false },
  { id: "8", category: "Facilitator Readiness", label: "Facilitator guides complete (all 10)", checked: true },
  { id: "9", category: "Facilitator Readiness", label: "Learner workbooks complete (all 10)", checked: true },
  { id: "10", category: "Facilitator Readiness", label: "Facilitator credentials submitted", checked: false },
  { id: "11", category: "Logistics", label: "Venue confirmed (CET Venda)", checked: false },
  { id: "12", category: "Logistics", label: "Laptop/device availability confirmed", checked: false },
  { id: "13", category: "Logistics", label: "USB tech packs prepared", checked: false },
  { id: "14", category: "Logistics", label: "Internet backup plan documented", checked: true },
];

export default function CompliancePage() {
  const [items, setItems] = useState(complianceItems);

  const toggle = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const categories = [...new Set(items.map((i) => i.category))];
  const totalDone = items.filter((i) => i.checked).length;

  return (
    <LmisLayout title="Compliance" subtitle={`${totalDone}/${items.length} items complete`}>
      <div className="space-y-6 max-w-2xl">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="font-display font-semibold text-foreground mb-3">{cat}</h3>
            <div className="space-y-2">
              {items.filter((i) => i.category === cat).map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card cursor-pointer hover:bg-secondary/50 transition-colors"
                >
                  <Checkbox checked={item.checked} onCheckedChange={() => toggle(item.id)} />
                  <span className={`text-sm ${item.checked ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </LmisLayout>
  );
}
