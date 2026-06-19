import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlaceholderTab } from "@/components/beacon/placeholder-tab";

export const Route = createFileRoute("/_authenticated/organizer/events/$id/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { id } = Route.useParams();
  const { data } = useQuery({
    queryKey: ["analytics", id],
    queryFn: async () => {
      const [{ count: teams }, { count: subs }, { count: members }, { data: subsByStatus }] = await Promise.all([
        supabase.from("teams").select("*", { count: "exact", head: true }).eq("event_id", id),
        supabase.from("submissions").select("*", { count: "exact", head: true }).eq("event_id", id),
        supabase.from("team_members").select("*, teams!inner(event_id)", { count: "exact", head: true }).eq("teams.event_id", id),
        supabase.from("submissions").select("status").eq("event_id", id),
      ]);
      const byStatus: Record<string, number> = {};
      for (const s of subsByStatus ?? []) byStatus[s.status] = (byStatus[s.status] ?? 0) + 1;
      return { teams, subs, members, byStatus };
    },
  });

  return (
    <PlaceholderTab title="Analytics" lead="A boardroom view of what happened — with the story, not just the numbers.">
      <div className="grid gap-5 sm:grid-cols-3">
        <Insight value={data?.teams ?? "—"} label="Teams" narrative="Teams formed across the registration window." />
        <Insight value={data?.members ?? "—"} label="Participants" narrative="Students who joined a team and entered the arena." />
        <Insight value={data?.subs ?? "—"} label="Submissions" narrative="Projects shipped — code, slides, and demos delivered." />
      </div>
      {data?.byStatus && Object.keys(data.byStatus).length > 0 && (
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <h3 className="font-display text-lg text-navy">Submission quality</h3>
          <p className="mt-1 text-sm text-muted-foreground">A snapshot of how submissions cleared automated validation.</p>
          <div className="mt-5 space-y-2.5">
            {Object.entries(data.byStatus).map(([k, v]) => {
              const total = (data?.subs as number) || 1;
              const pct = Math.round((v / total) * 100);
              return (
                <div key={k}>
                  <div className="flex items-center justify-between text-xs"><span className="capitalize text-navy">{k}</span><span className="text-muted-foreground">{v} · {pct}%</span></div>
                  <div className="mt-1 h-1.5 rounded-full bg-beige overflow-hidden"><div className="h-full bg-navy" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlaceholderTab>
  );
}

function Insight({ value, label, narrative }: { value: any; label: string; narrative: string }) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card">
      <div className="font-display text-4xl text-navy tabular-nums">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-teal">{label}</div>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{narrative}</p>
    </div>
  );
}