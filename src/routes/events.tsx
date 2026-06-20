import { createFileRoute } from "@tanstack/react-router";
import { BeaconLogo } from "@/components/beacon/logo";

export const Route = createFileRoute("/events")({
  head: () => ({ meta: [{ title: "Events — Beacon HQ" }] }),
  component: Events,
});

function Events() {
  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="w-16"><BeaconLogo /></div>
          <div>
            <h1 className="font-display text-3xl text-navy">Events</h1>
            <p className="text-sm text-muted-foreground">Browse or create events — an organizer workspace for managing hackathons and competitions.</p>
          </div>
        </div>

        <section className="mt-6 text-sm text-muted-foreground">
          <p>This is a public events page placeholder. Authenticated organizers can manage events from their dashboard.</p>
        </section>
      </div>
    </div>
  );
}
