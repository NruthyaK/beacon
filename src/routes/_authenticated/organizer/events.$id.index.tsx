import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, FileCode, Gavel, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/organizer/events/$id/")({
  component: Overview,
});

function Overview() {
  const { id } = Route.useParams();
  const { data } = useQuery({
    queryKey: ["event-overview", id],
    queryFn: async () => {
      const [{ data: event }, { data: problems }, { data: criteria }, { count: teams }, { count: subs }, { count: jury }] = await Promise.all([
        supabase.from("events").select("*").eq("id", id).maybeSingle(),
        supabase.from("problem_statements").select("*").eq("event_id", id),
        supabase.from("judging_criteria").select("*").eq("event_id", id).order("sort_order"),
        supabase.from("teams").select("*", { count: "exact", head: true }).eq("event_id", id),
        supabase.from("submissions").select("*", { count: "exact", head: true }).eq("event_id", id),
        supabase.from("jury_members").select("*", { count: "exact", head: true }).eq("event_id", id),
      ]);
      return { event, problems: problems ?? [], criteria: criteria ?? [], teams: teams ?? 0, subs: subs ?? 0, jury: jury ?? 0 };
    },
  });

  if (!data?.event) return null;
  const { event, problems, criteria, teams, subs, jury } = data;

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-4">
        <MetricTile label="Jury" value={jury} icon={<Users className="h-4 w-4" />} href={`/organizer/events/${id}/jury`} />
        <MetricTile label="Teams" value={teams} icon={<Users className="h-4 w-4" />} href={`/organizer/events/${id}/teams`} />
        <MetricTile label="Submissions" value={subs} icon={<FileCode className="h-4 w-4" />} href={`/organizer/events/${id}/submissions`} />
        <MetricTile label="Judging" value={event.judging_open ? "Open" : "Closed"} icon={<Gavel className="h-4 w-4" />} href={`/organizer/events/${id}/judging`} />
      </div>

      {event.welcome_message && (
        <section className="rounded-2xl border bg-beige/40 p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Welcome message</div>
          <p className="font-display text-lg text-navy leading-relaxed">{event.welcome_message}</p>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-2">
        <Card title={`Problem statements (${problems.length})`}>
          {problems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No problem statements added yet.</p>
          ) : (
            <ul className="space-y-3">
              {problems.map((p) => (
                <li key={p.id} className="rounded-lg border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-display text-base text-navy">{p.title}</div>
                    <span className="text-[10px] uppercase tracking-wider rounded-full bg-beige px-2 py-0.5 text-muted-foreground">{p.difficulty}</span>
                  </div>
                  {p.description && <p className="mt-1.5 text-sm text-muted-foreground">{p.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title={`Judging criteria (${criteria.reduce((s, c) => s + c.max_points, 0)} pts total)`}>
          {criteria.length === 0 ? (
            <p className="text-sm text-muted-foreground">No criteria defined yet.</p>
          ) : (
            <ul className="divide-y">
              {criteria.map((c) => (
                <li key={c.id} className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-navy">{c.name}</span>
                  <span className="text-sm font-medium text-muted-foreground tabular-nums">{c.max_points} pts</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}

function MetricTile({ label, value, icon, href }: { label: string; value: any; icon: React.ReactNode; href: string }) {
  return (
    <Link to={href as any} className="group rounded-xl border bg-card p-5 hover:shadow-card transition-shadow">
      <div className="flex items-center justify-between text-muted-foreground">
        <div className="text-[11px] uppercase tracking-wider">{label}</div>
        <div className="text-teal/70">{icon}</div>
      </div>
      <div className="mt-2 font-display text-3xl text-navy tabular-nums">{value}</div>
    </Link>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card">
      <h3 className="font-display text-lg text-navy mb-4">{title}</h3>
      {children}
    </div>
  );
}