import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  variant?: "default" | "accent" | "success" | "warning";
}

const variantStyles = {
  default: "border-border",
  accent: "border-accent/30 bg-accent/5",
  success: "border-success/30 bg-success/5",
  warning: "border-warning/30 bg-warning/5",
};

const iconStyles = {
  default: "bg-secondary text-foreground",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

export default function StatCard({ label, value, icon, variant = "default" }: StatCardProps) {
  return (
    <div className={`rounded-lg border p-5 stat-card-shadow ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-display font-bold mt-1">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${iconStyles[variant]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
