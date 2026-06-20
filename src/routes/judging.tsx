import { createFileRoute } from "@tanstack/react-router";
import { BeaconLogo } from "@/components/beacon/logo";

export const Route = createFileRoute("/judging")({
  head: () => ({ meta: [{ title: "Judging — Beacon HQ" }] }),
  component: Judging,
});

function Judging() {
  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="w-16"><BeaconLogo /></div>
          <div>
            <h1 className="font-display text-3xl text-navy">Judging</h1>
            <p className="text-sm text-muted-foreground">Information about judging workflows and how jury members can participate.</p>
          </div>
        </div>

        <section className="mt-6 text-sm text-muted-foreground">
          <p>This is a placeholder page describing judging tools and workflows. Jury members can access scoring from their invite links.</p>
        </section>
      </div>
    </div>
  );
}
