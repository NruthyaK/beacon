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
            <FeatureCard icon={<IconEvent />} title="Event Management" href="/organizer/events" description="Create and manage hackathons, deadlines, registrations, and teams." />
            <FeatureCard icon={<IconJudge />} title="Judging & Jury" href="/organizer/events/" description="Invite jury, assign submissions and run structured scoring workflows." />
            <FeatureCard icon={<IconLeaderboard />} title="Live Leaderboards" href="/leaderboard/" description="Real-time leaderboards to showcase top teams and moments." />
            <FeatureCard icon={<IconCertificate />} title="Verified Certificates" href="/organizer/events/" description="Issue official certificates automatically after events." />
            <FeatureCard icon={<IconUser />} title="Participant Portal" href="/login" description="Participants can view their registrations, scores, and certificates." />
            <FeatureCard icon={<IconIntegrations />} title="Integrations" href="/login" description="Google, GitHub, Microsoft SSO and LMS integrations." />
          </div>
        </section>

        <footer className="mt-20 text-center text-sm text-muted-foreground">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6">
            <div>beacont.ai · Hyderabad</div>
            <div className="flex gap-3">
              <Link to="/about" className="hover:underline">About</Link>
              <Link to="/privacy" className="hover:underline">Privacy</Link>
              <a href="mailto:hello@beacont.ai" className="hover:underline">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function IconEvent() {
  return (
    <svg className="h-6 w-6 text-teal" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="14" width="18" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconJudge() {
  return (
    <svg className="h-6 w-6 text-indigo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconLeaderboard() {
  return (
    <svg className="h-6 w-6 text-orange" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="6" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="16" y="2" width="4" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconCertificate() {
  return (
    <svg className="h-6 w-6 text-fuchsia" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 21v-4l4 2 4-2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg className="h-6 w-6 text-sky" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 20c1.5-3 4.5-5 8-5s6.5 2 8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconIntegrations() {
  return (
    <svg className="h-6 w-6 text-emerald" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.5 7.5l3.5 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M16.5 7.5l-3.5 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function FeatureCard({ title, description, href, icon }: { title: string; description: string; href: string; icon: React.ReactNode }) {
  return (
    <a href={href} className="group block rounded-lg border border-input bg-background p-6 hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">{icon}</div>
        <div>
          <div className="text-lg font-medium text-navy">{title}</div>
          <div className="mt-1 text-sm text-muted-foreground">{description}</div>
        </div>
      </div>
    </a>
  );
}
