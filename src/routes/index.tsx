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
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="mx-auto w-full max-w-2xl text-center">
        <div className="mb-8 flex justify-center">
          <BeaconLogo />
        </div>
        <h1 className="font-display text-4xl text-navy">Beacon HQ</h1>
        <p className="mt-2 text-sm text-muted-foreground">Illuminating your workspace…</p>

        <div className="mt-8 flex justify-center gap-3">
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
        </div>
      </div>
    </div>
  );
}
