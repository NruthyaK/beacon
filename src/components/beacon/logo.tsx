import { cn } from "@/lib/utils";

export function BeaconLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative h-8 w-8 rounded-md bg-navy text-background flex items-center justify-center shadow-card">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L4 14h6l-2 8 10-14h-6l2-6z" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-base font-bold tracking-tight text-navy">Beacon HQ</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-0.5">by Beacon Technologies</span>
      </div>
    </div>
  );
}

export function BeaconMark({ className }: { className?: string }) {
  return (
    <div className={cn("h-8 w-8 rounded-md bg-navy text-background flex items-center justify-center shadow-card", className)}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L4 14h6l-2 8 10-14h-6l2-6z" />
      </svg>
    </div>
  );
}