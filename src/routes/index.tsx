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
    if (!user) { navigate({ to: "/login" }); return; }
    if (role === "organizer") navigate({ to: "/organizer/dashboard" });
    else if (role === "jury") navigate({ to: "/login" }); // jury arrives via magic link
    else navigate({ to: "/login" }); // participant lands on a specific event link
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
