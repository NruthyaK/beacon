import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { BeaconLogo } from "@/components/beacon/logo";

export const Route = createFileRoute("/organizer/events")({
  head: () => ({ meta: [{ title: "Organizer Events — Beacon HQ" }] }),
  component: OrganizerEvents,
});

function OrganizerEvents() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user || role !== 'organizer') {
      navigate({ to: '/login' });
    }
  }, [loading, user, role, navigate]);

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="w-16"><BeaconLogo /></div>
          <div>
            <h1 className="font-display text-3xl text-navy">Organizer — Events</h1>
            <p className="text-sm text-muted-foreground">Create and manage your events from this dashboard.</p>
          </div>
        </div>

        <section className="mt-6 text-sm text-muted-foreground">
          <p>This page is protected — only organizers can access event management tools. Use the organizer dashboard to create events.</p>
        </section>
      </div>
    </div>
  );
}
