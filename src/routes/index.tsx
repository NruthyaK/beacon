import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { BeaconLogo } from "@/components/beacon/logo";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { loading, user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    // Keep organizers routed to their dashboard, but otherwise
    // leave the index page as the site's home instead of forcing
    // unauthenticated users to the login page.
    if (user && role === "organizer") {
      navigate({ to: "/organizer/dashboard" });
    }
  }, [loading, user, role, navigate]);

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            <BeaconLogo />
          </div>
          <h1 className="font-display text-5xl text-navy">Beacon HQ</h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
            The command center for student innovation — manage events, judging, leaderboards, and certificates from one premium platform.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {!user ? (
              <Link to="/login">
                <Button className="px-6">Sign in</Button>
              </Link>
            ) : role === "organizer" ? (
              <Link to="/organizer/dashboard">
                <Button className="px-6">Open dashboard</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="px-6">Sign in</Button>
              </Link>
            )}
            <a href="/leaderboard/" className="inline-flex items-center">
              <Button variant="outline">Browse leaderboard</Button>
            </a>
            <Link to="/about">
              <Button variant="ghost">About Beacon</Button>
            </Link>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-center font-semibold text-2xl text-navy">What we offer</h2>
          <p className="mt-2 text-center text-muted-foreground">All tools you need to run student innovation programs.</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard title="Event Management" href="/organizer/events" description="Create and manage hackathons, deadlines, registrations, and teams." />
            <FeatureCard title="Judging & Jury" href="/organizer/events/" description="Invite jury, assign submissions and run scoring workflows." />
            <FeatureCard title="Leaderboards" href="/leaderboard/" description="Live leaderboards to showcase top teams and participants." />
            <FeatureCard title="Certificates" href="/organizer/events/" description="Issue verified certificates automatically after events." />
            <FeatureCard title="Participant Portal" href="/login" description="Participants can view registrations, scores, and certificates." />
            <FeatureCard title="Integrations" href="/login" description="Google SSO, GitHub, Microsoft and LMS integrations." />
          </div>
        </section>

        <footer className="mt-20 text-center text-sm text-muted-foreground">beacont.ai · Hyderabad</footer>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <a href={href} className="block rounded-lg border border-input bg-background p-6 hover:shadow-md">
      <div className="text-lg font-medium text-navy">{title}</div>
      <div className="mt-2 text-sm text-muted-foreground">{description}</div>
    </a>
  );
}
