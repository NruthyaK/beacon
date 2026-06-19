import { createFileRoute, Outlet } from "@tanstack/react-router";
import { OrganizerShell, RequireRole, EventTabs } from "@/components/beacon/organizer-shell";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/beacon/status-badge";

export const Route = createFileRoute("/_authenticated/organizer/events/$id")({
  component: EventLayout,
});

function EventLayout() {
  const { id } = Route.useParams();
  const { data: event } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <RequireRole role="organizer">
      <OrganizerShell>
        {event && (
          <header className="mb-6 space-y-3">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <span>{event.college}</span>
              <span>·</span>
              <span>{new Date(event.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h1 className="font-display text-4xl text-navy leading-tight">{event.name}</h1>
              <StatusBadge status={event.status as any} />
            </div>
          </header>
        )}
        <EventTabs eventId={id} />
        <Outlet />
      </OrganizerShell>
    </RequireRole>
  );
}