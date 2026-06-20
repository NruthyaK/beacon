import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <div className="font-display text-2xl text-navy">Beacon HQ</div>
        <div className="text-sm text-muted-foreground">Illuminating your workspace…</div>
      </div>
    </div>
  );
}
