import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchRole } from "@/lib/auth-utils";

export const Route = createFileRoute("/auth/finish")({
  head: () => ({ meta: [{ title: "Signing in — Beacon HQ" }] }),
  component: AuthFinish,
});

function AuthFinish() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading'|'ok'|'forbidden'>('loading');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [wantedRole, setWantedRole] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const params = new URL(window.location.href).searchParams;
        const wanted = params.get('wantedRole');
        if (wanted && mounted) setWantedRole(wanted);

        const { data } = await supabase.auth.getSession();
        const user = data.session?.user ?? null;
        if (!user) {
          window.location.href = "/login";
          return;
        }
        if (mounted) setUserEmail(user.email ?? null);

        const role = await fetchRole(user.id);
        if (!mounted) return;

        if (wanted === 'organizer' && role !== 'organizer') {
          // Signed-in user is not an organizer — show a friendly message instead of redirect.
          setStatus('forbidden');
          return;
        }

        // Normal flow: redirect based on role
        if (role === 'organizer') window.location.href = '/organizer/dashboard';
        else window.location.href = '/';
      } catch (e) {
        console.error(e);
        window.location.href = "/";
      }
    })();
    return () => { mounted = false; };
  }, [navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Signing you in…</div>
          <div className="text-sm text-muted-foreground">Please wait while we finish setting up your session.</div>
        </div>
      </div>
    );
  }

  // Forbidden UI when user attempted organizer flow but doesn't have organizer role
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg text-center p-6 bg-background border rounded-lg">
        <h2 className="text-2xl font-medium">Organizer access restricted</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Organizer access is restricted to Beacon Technologies staff or accounts explicitly granted organizer privileges.
        </p>
        {userEmail && (
          <p className="mt-3 text-sm">Signed in as <span className="font-medium">{userEmail}</span></p>
        )}
        <div className="mt-6 flex justify-center gap-2">
          <button className="px-4 py-2 bg-navy text-white rounded" onClick={() => { window.location.href = '/'; }}>
            Continue as participant
          </button>
          <button className="px-4 py-2 border rounded" onClick={() => { supabase.auth.signOut().then(() => { window.location.href = '/login'; }); }}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
