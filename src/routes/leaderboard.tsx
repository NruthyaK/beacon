import { createFileRoute } from "@tanstack/react-router";
import { BeaconLogo } from "@/components/beacon/logo";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboards — Beacon HQ" }] }),
  component: Leaderboard,
});

function Leaderboard() {
  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="w-16"><BeaconLogo /></div>
          <div>
            <h1 className="font-display text-3xl text-navy">Leaderboards</h1>
            <p className="text-sm text-muted-foreground">Live leaderboards for ongoing events. Select an event to view rankings.</p>
          </div>
        </div>

        <section className="mt-6 text-sm text-muted-foreground">
          <p>This is a public leaderboard index placeholder. Individual event leaderboards are available via event links.</p>
        </section>
      </div>
    </div>
  );
}
