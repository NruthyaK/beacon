import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { OrganizerShell, RequireRole } from "@/components/beacon/organizer-shell";
import { StatusBadge } from "@/components/beacon/status-badge";
import { EmptyState } from "@/components/beacon/empty-state";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/organizer/events/")({
  component: () => (
    <RequireRole role="organizer">
      <OrganizerShell>
        <AllEvents />
      </OrganizerShell>
    </RequireRole>
  ),
});

function AllEvents() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["all-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.22em] text-teal">Catalogue</div>
          <h1 className="font-display text-4xl text-navy">All events</h1>
        </div>
      </header>

      {isLoading ? (
        <div className="rounded-2xl border bg-card p-12 text-center text-sm text-muted-foreground">Loading…</div>
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="h-5 w-5" />}
          title="No events yet"
          description="Create your first hackathon to unlock jury management, submissions, and certificates."
          action={
            <Button onClick={() => navigate({ to: "/organizer/events/new" })} className="bg-navy text-background hover:bg-navy/90">
              Create event
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.map((e) => (
            <Link
              key={e.id}
              to={`/organizer/events/${e.id}` as string}
              className="group rounded-2xl border bg-card p-6 shadow-card transition-shadow hover:shadow-elevated"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{e.college}</div>
                <StatusBadge status={e.status as any} />
              </div>
              <h3 className="mt-4 font-display text-xl text-navy group-hover:text-teal transition-colors">{e.name}</h3>
              <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground tabular-nums">
                <span>{new Date(e.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                <span>Team size · {e.max_team_size}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}