import type { ReactNode } from "react";

export function EmptyState({
  title, description, action, icon,
}: { title: string; description: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed bg-card/60 px-8 py-16 text-center">
      {icon && <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-beige text-teal">{icon}</div>}
      <h3 className="font-display text-xl text-navy">{title}</h3>
      <p className="mt-2 mx-auto max-w-md text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}