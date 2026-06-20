import { createFileRoute } from "@tanstack/react-router";
import { BeaconLogo } from "@/components/beacon/logo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Beacon HQ" },
      { name: "description", content: "About Beacon HQ — the command center for student innovation." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="w-16"><BeaconLogo /></div>
          <div>
            <h1 className="font-display text-3xl text-navy">About Beacon HQ</h1>
            <p className="text-sm text-muted-foreground">Illuminating your workspace — events, judging, leaderboards, and certificates in one place.</p>
          </div>
        </div>

        <section className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold text-navy">Our mission</h2>
          <p className="text-muted-foreground">Beacon HQ exists to simplify running student innovation programs. We provide organizers, jury members, and participants with a focused, polished experience that covers the full lifecycle of an event — from creation to certificates.</p>
        </section>

        <section className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-medium">For organizers</h3>
            <p className="text-sm text-muted-foreground">Create events, manage registrations, invite jury, review submissions, and publish results — all with privacy and auditability in mind.</p>
          </div>
          <div>
            <h3 className="font-medium">For jury</h3>
            <p className="text-sm text-muted-foreground">Invite reviewers, assign judging tasks, and provide structured scoring workflows to make evaluation fair and efficient.</p>
          </div>
          <div>
            <h3 className="font-medium">For participants</h3>
            <p className="text-sm text-muted-foreground">Sign in with institutional SSO, track registrations, view live leaderboards, and download official certificates.</p>
          </div>
          <div>
            <h3 className="font-medium">Integrations</h3>
            <p className="text-sm text-muted-foreground">Supports Google, GitHub, Microsoft SSO and can connect to LMS systems and common analytics stacks.</p>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="font-medium">Want to get started?</h3>
          <p className="text-sm text-muted-foreground">Visit the <a href="/login" className="text-navy underline">Sign in</a> page to create an organizer account or continue as a participant. For partnership inquiries, email hello@beacont.ai.</p>
        </section>
      </div>
    </div>
  );
}
