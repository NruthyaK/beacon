import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Props {
  label: string;
  value: ReactNode;
  caption?: ReactNode;
  accent?: "default" | "live";
  icon?: ReactNode;
}

export function StatCard({ label, value, caption, accent = "default", icon }: Props) {
  return (
    <div className="group relative rounded-2xl border bg-card p-6 shadow-card transition-shadow hover:shadow-elevated">
      <div className="flex items-start justify-between gap-3">
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
        {icon && <div className="text-teal/70">{icon}</div>}
      </div>
      <div className="mt-4 flex items-baseline gap-2.5">
        <div className="font-display text-4xl font-bold text-navy tabular-nums">{value}</div>
        {accent === "live" && (
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
        )}
      </div>
      {caption && <div className="mt-1.5 text-xs text-muted-foreground">{caption}</div>}
    </div>
  );
}