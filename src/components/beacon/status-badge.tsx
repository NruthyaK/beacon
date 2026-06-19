import { cn } from "@/lib/utils";

type Status = "draft" | "upcoming" | "live" | "judging" | "completed" | "overdue";

const styles: Record<Status, string> = {
  draft:      "border-dashed border-muted-foreground/40 text-muted-foreground",
  upcoming:   "bg-sky/40 text-navy border-transparent",
  live:       "bg-success/15 text-success border-transparent",
  judging:    "bg-warning/15 text-[oklch(0.45_0.10_70)] border-transparent",
  completed:  "bg-muted text-muted-foreground border-transparent",
  overdue:    "bg-warning/20 text-[oklch(0.45_0.10_70)] border-transparent",
};

const labels: Record<Status, string> = {
  draft: "Draft", upcoming: "Upcoming", live: "Live",
  judging: "Judging", completed: "Completed", overdue: "Overdue",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider",
      styles[status],
      className,
    )}>
      {status === "live" && (
        <span className="relative inline-flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 animate-ping" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
        </span>
      )}
      {labels[status]}
    </span>
  );
}