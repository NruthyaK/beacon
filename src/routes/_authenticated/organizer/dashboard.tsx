import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Users, Award, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { OrganizerShell, RequireRole } from "@/components/beacon/organizer-shell";
import { StatCard } from "@/components/beacon/stat-card";
import { StatusBadge } from "@/components/beacon/status-badge";
import { EmptyState } from "@/components/beacon/empty-state";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/organizer/dashboard")({
  component: () => (
    <RequireRole role="organizer">
      <OrganizerShell>
        <DashboardPage />
      </OrganizerShell>
    </RequireRole>
  ),
});

function DashboardPage() {
  const navigate = useNavigate();

  const { data: events, isLoading } = useQuery({
    queryKey: ["dashboard-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: 15_000,
  });

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [{ count: eventCount }, { count: teamCount }, { count: certCount }] = await Promise.all([
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("team_members").select("*", { count: "exact", head: true }),
        supabase.from("certificates").select("*", { count: "exact", head: true }),
      ]);
      const live = (events ?? []).filter((e) => e.status === "live").length;
      return {
        total: eventCount ?? 0,
        live,
        participants: teamCount ?? 0,
        certificates: certCount ?? 0,
      };
    },
    enabled: !!events,
  });

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <div className="text-xs uppercase tracking-[0.22em] text-teal">Overview</div>
        <h1 className="font-display text-5xl text-navy leading-tight">Innovation, illuminated.</h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Every hackathon, jury panel, and certificate — managed from a single editorial workspace.
        </p>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Events" value={stats?.total ?? "—"} caption="across all colleges" icon={<CalendarDays className="h-4 w-4" />} />
        <StatCard label="Active Now" value={stats?.live ?? "—"} caption="events running live" accent="live" icon={<Activity className="h-4 w-4" />} />
        <StatCard label="Participants" value={stats?.participants ?? "—"} caption="registered students" icon={<Users className="h-4 w-4" />} />
        <StatCard label="Certificates" value={stats?.certificates ?? "—"} caption="issued to date" icon={<Award className="h-4 w-4" />} />
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl text-navy">Recent events</h2>
            <p className="text-sm text-muted-foreground">Click an event to manage jury, submissions, and judging.</p>
          </div>
          <Link to="/organizer/events" className="text-sm font-medium text-teal hover:underline">View all →</Link>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border bg-card p-12 text-center text-sm text-muted-foreground">Loading events…</div>
        ) : !events || events.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="h-5 w-5" />}
            title="No events yet"
            description="Start by creating your first hackathon. You'll add problem statements, judging criteria, and jury members in a single editorial flow."
            action={
              <Button onClick={() => navigate({ to: "/organizer/events/new" })} className="bg-navy text-background hover:bg-navy/90">
                Create your first event
              </Button>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
            <table className="w-full">
              <thead className="bg-beige/60">
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4">College</th>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {events.map((e) => {
                  const overdue = e.status === "upcoming" && new Date(e.event_date) < new Date();
                  const status = overdue ? "overdue" : (e.status as any);
                  return (
                    <tr key={e.id} className="text-sm hover:bg-beige/30 transition-colors">
                      <td className="px-6 py-5 text-muted-foreground">{e.college}</td>
                      <td className="px-6 py-5 font-display text-base text-navy">{e.name}</td>
                      <td className="px-6 py-5 text-muted-foreground tabular-nums">
                        {new Date(e.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-5"><StatusBadge status={status} /></td>
                      <td className="px-6 py-5 text-right">
                        <Link to={`/organizer/events/${e.id}` as string} className="text-sm font-medium text-teal hover:underline">
                          Open →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}