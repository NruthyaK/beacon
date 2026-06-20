import { createFileRoute } from "@tanstack/react-router";
import { BeaconLogo } from "@/components/beacon/logo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — Beacon HQ" },
      { name: "description", content: "Privacy policy for Beacon HQ" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="w-16"><BeaconLogo /></div>
          <div>
            <h1 className="font-display text-3xl text-navy">Privacy policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: 2026</p>
          </div>
        </div>

        <section className="mt-4 space-y-4 text-sm text-muted-foreground">
          <p>Beacon HQ collects only the information necessary to operate events, authenticate users, and issue certificates. We use Supabase for authentication and storage.</p>
          <p>We retain personal data for the duration of the event and as required for audit and certificate issuance. You can contact hello@beacont.ai for data access or deletion requests.</p>
          <p>We do not sell personal data. For more details, contact hello@beacont.ai.</p>
        </section>
      </div>
    </div>
  );
}
