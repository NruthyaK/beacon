import type { ReactNode } from "react";

export function PlaceholderTab({
  title, lead, children,
}: { title: string; lead: string; children?: ReactNode }) {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="font-display text-2xl text-navy">{title}</h2>
        <p className="text-sm text-muted-foreground max-w-2xl">{lead}</p>
      </header>
      {children}
    </div>
  );
}