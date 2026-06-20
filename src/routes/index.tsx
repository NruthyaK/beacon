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
            <FeatureCard icon={<IconEvent />} title="Event Management" href="/events" description="Create and manage hackathons, deadlines, registrations, and teams." />
            <FeatureCard icon={<IconJudge />} title="Judging & Jury" href="/judging" description="Invite jury, assign submissions and run structured scoring workflows." />
            <FeatureCard icon={<IconLeaderboard />} title="Live Leaderboards" href="/leaderboard" description="Real-time leaderboards to showcase top teams and moments." />
            <FeatureCard icon={<IconCertificate />} title="Verified Certificates" href="/events" description="Issue official certificates automatically after events." />
            <FeatureCard icon={<IconUser />} title="Participant Portal" href="/login" description="Participants can view their registrations, scores, and certificates." />
            <FeatureCard icon={<IconIntegrations />} title="Integrations" href="/about" description="Google, GitHub, Microsoft SSO and LMS integrations." />
          </div>
        </section>

        <footer className="mt-20 text-center text-sm text-muted-foreground">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
            <div>beacont.ai · Hyderabad</div>
            <div className="flex items-center gap-4">
              <Link to="/about" className="hover:underline">About</Link>
              <Link to="/privacy" className="hover:underline">Privacy</Link>
              <a href="mailto:hello@beacont.ai" className="hover:underline">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://twitter.com/beacont" aria-label="Twitter" className="text-muted-foreground hover:text-navy">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 5.92c-.66.29-1.37.49-2.12.58.76-.46 1.34-1.19 1.61-2.06-.71.42-1.5.73-2.34.9C18.42 4.2 17.24 3.5 16 3.5c-1.87 0-3.39 1.52-3.39 3.39 0 .27.03.53.09.78-2.82-.14-5.32-1.49-7-3.54-.29.5-.45 1.08-.45 1.7 0 1.17.6 2.2 1.51 2.8-.56-.02-1.09-.17-1.55-.43v.04c0 1.64 1.17 3.01 2.72 3.32-.28.08-.57.12-.87.12-.21 0-.41-.02-.61-.06.41 1.29 1.6 2.23 3.01 2.26-1.1.86-2.49 1.37-3.99 1.37-.26 0-.52-.02-.77-.05 1.43.92 3.12 1.45 4.93 1.45 5.92 0 9.16-4.9 9.16-9.16v-.42c.63-.45 1.17-1.03 1.6-1.68-.58.26-1.2.44-1.85.52.67-.4 1.18-1.03 1.42-1.78z"/></svg>
              </a>
              <a href="https://linkedin.com/company/beacont" aria-label="LinkedIn" className="text-muted-foreground hover:text-navy">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4.98 3.5C3.88 3.5 3 4.38 3 5.48 3 6.58 3.88 7.46 4.98 7.46c1.1 0 1.98-.88 1.98-1.98 0-1.1-.88-1.98-1.98-1.98zM3.5 9h3v12h-3V9zM9 9h2.9v1.6h.04c.4-.76 1.38-1.56 2.85-1.56 3.05 0 3.62 2.01 3.62 4.62V21h-3v-5.02c0-1.2-.02-2.74-1.67-2.74-1.67 0-1.92 1.3-1.92 2.65V21H9V9z"/></svg>
              </a>
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
