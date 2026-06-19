import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Maximize2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PlaceholderTab } from "@/components/beacon/placeholder-tab";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { computeLeaderboard } from "@/lib/leaderboard";

export const Route = createFileRoute("/_authenticated/organizer/events/$id/leaderboard")({
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["lb", id],
    queryFn: async () => {
      const [{ data: event }, { data: subs }, { data: scores }] = await Promise.all([
        supabase.from("events").select("*").eq("id", id).maybeSingle(),
        supabase.from("submissions").select("id, project_name, teams(name, college)").eq("event_id", id),
        supabase.from("scores").select("submission_id, points"),
      ]);
      return { event, rows: computeLeaderboard(subs ?? [], scores ?? []) };
    },
    refetchInterval: 10_000,
  });

  async function togglePublic(v: boolean) {
    await supabase.from("events").update({ leaderboard_public: v }).eq("id", id);
    toast.success(v ? "Leaderboard is now public" : "Leaderboard hidden from public");
    qc.invalidateQueries({ queryKey: ["lb", id] });
  }

  return (
    <PlaceholderTab title="Leaderboard" lead="Live ranking. Updates every 10 seconds.">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => togglePublic(!data?.event?.leaderboard_public)} variant="outline">
          {data?.event?.leaderboard_public ? "Hide from public" : "Make leaderboard public"}
        </Button>
        <Link to={`/leaderboard/${id}` as any} target="_blank" className="inline-flex items-center gap-1.5 rounded-md border bg-beige px-3 py-2 text-sm text-navy hover:bg-sky/40">
          <ExternalLink className="h-4 w-4" /> Open public view
        </Link>
        <Button variant="ghost" onClick={() => document.documentElement.requestFullscreen()}><Maximize2 className="mr-2 h-4 w-4" /> Fullscreen</Button>
      </div>

      {!data || data.rows.length === 0 ? (
        <div className="rounded-2xl border bg-card p-12 text-center text-sm text-muted-foreground">
          Leaderboard will be visible once judging begins.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
          <table className="w-full">
            <thead className="bg-beige/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-6 py-4">Rank</th><th className="px-6 py-4">Team</th><th className="px-6 py-4">Project</th><th className="px-6 py-4 text-right">Score</th></tr>
            </thead>
            <tbody className="divide-y">
              {data.rows.map((r, i) => (
                <tr key={r.id} className={`border-l-4 ${i === 0 ? "border-l-warning" : i === 1 ? "border-l-muted-foreground" : i === 2 ? "border-l-[oklch(0.55_0.13_30)]" : "border-l-transparent"}`}>
                  <td className="px-6 py-4 font-display text-2xl text-navy">{i + 1}</td>
                  <td className="px-6 py-4 text-sm"><div className="text-navy font-medium">{r.team}</div><div className="text-xs text-muted-foreground">{r.college}</div></td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{r.project_name}</td>
                  <td className="px-6 py-4 text-right font-display text-xl text-navy tabular-nums">{r.score.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PlaceholderTab>
  );
}