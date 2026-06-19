import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Maximize2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BeaconLogo } from "@/components/beacon/logo";
import { Button } from "@/components/ui/button";
import { computeLeaderboard } from "@/lib/leaderboard";

export const Route = createFileRoute("/leaderboard/$eventId")({
  head: () => ({
    meta: [
      { title: "Live Leaderboard — Beacon HQ" },
      { name: "description", content: "Live rankings, updated every 10 seconds." },
    ],
  }),
  component: PublicLeaderboard,
});

function PublicLeaderboard() {
  const { eventId } = Route.useParams();
  const { data } = useQuery({
    queryKey: ["public-lb", eventId],
    queryFn: async () => {
      const [{ data: event }, { data: subs }, { data: scores }] = await Promise.all([
        supabase.from("events").select("*").eq("id", eventId).maybeSingle(),
        supabase.from("submissions").select("id, project_name, teams(name, college)").eq("event_id", eventId),
        supabase.from("scores").select("submission_id, points"),
      ]);
      return { event, rows: computeLeaderboard(subs ?? [], scores ?? []) };
    },
    refetchInterval: 10_000,
  });

  if (!data?.event) return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;

  if (!data.event.leaderboard_public && data.event.status !== "completed") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <BeaconLogo />
        <h2 className="mt-8 font-display text-2xl text-navy">Results will be announced soon</h2>
        <p className="mt-2 text-sm text-muted-foreground">Check back once the organizer publishes the leaderboard.</p>
      </div>
    );
  }

  const isFinal = data.event.status === "completed";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <BeaconLogo />
          <Button variant="ghost" size="sm" onClick={() => document.documentElement.requestFullscreen()}><Maximize2 className="mr-2 h-4 w-4" /> Fullscreen</Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-12 space-y-6">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.22em] text-teal">{isFinal ? "Final Results" : "Live · Updates every 10s"}</div>
          <h1 className="mt-2 font-display text-5xl text-navy">{data.event.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{data.event.college}</p>
        </div>
        {data.rows.length === 0 ? (
          <div className="rounded-2xl border bg-card p-12 text-center text-sm text-muted-foreground">All teams are currently tied. Judging is still in progress.</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
            <ul className="divide-y">
              {data.rows.map((r, i) => (
                <li key={r.id} className={`flex items-center gap-6 px-8 py-6 border-l-4 ${i === 0 ? "border-l-warning" : i === 1 ? "border-l-muted-foreground" : i === 2 ? "border-l-[oklch(0.55_0.13_30)]" : "border-l-transparent"}`}>
                  <div className="font-display text-4xl text-navy tabular-nums w-12">{i + 1}</div>
                  {i < 3 && <Trophy className={`h-5 w-5 ${i === 0 ? "text-warning" : i === 1 ? "text-muted-foreground" : "text-[oklch(0.55_0.13_30)]"}`} />}
                  <div className="flex-1">
                    <div className="font-display text-xl text-navy">{r.team}</div>
                    <div className="text-xs text-muted-foreground">{r.college} · {r.project_name}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="text-center text-xs text-muted-foreground">Powered by Beacon HQ · Illuminate. Empower. Transform.</div>
      </main>
    </div>
  );
}