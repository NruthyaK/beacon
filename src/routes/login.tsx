import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BeaconLogo } from "@/components/beacon/logo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Beacon HQ" },
      { name: "description", content: "Sign in to Beacon HQ to manage hackathons, jury, leaderboards, and certificates." },
    ],
  }),
  component: LoginPage,
});

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72);

async function oauthSignIn(provider: "google" | "github" | "microsoft", wantedRole?: string) {
  try {
    // Try Supabase OAuth directly. Attach the desired role as query so /auth/finish
    // can show a friendly message if the signed-in account isn't eligible.
    const finishBase = `${window.location.origin}/auth/finish`;
    const finishUrl = wantedRole ? `${finishBase}?wantedRole=${encodeURIComponent(wantedRole)}` : finishBase;
    const { data, error } = await supabase.auth.signInWithOAuth({ provider }, { redirectTo: finishUrl });
    if (error) {
      // Helpful error for common misconfiguration: missing OAuth secret in Supabase
      const msg = String(error.message ?? error);
      if (msg.toLowerCase().includes("missing oauth secret") || msg.toLowerCase().includes("unsupported provider")) {
        const callback = `${import.meta.env.VITE_SUPABASE_URL || ''}/auth/v1/callback`;
        toast.error(`Provider not configured. Add the provider client ID/secret in Supabase (Auth → Providers) and register the callback URL: ${callback}`);
        console.error("OAuth provider error:", error);
        return;
      }
      // Fallback to lovable wrapper if Supabase call fails for other reasons
      try {
        const res = await lovable.auth.signInWithOAuth(provider as any, { redirect_uri: window.location.origin });
        if (res.error) throw res.error;
        if (res.redirected) return;
      } catch (e) {
        toast.error("We couldn't sign you in. Try again.");
        console.error(e);
        return;
      }
    }
    // If Supabase returned a provider URL, redirect the browser there.
    if (data && (data as any).url) {
      window.location.href = (data as any).url;
      return;
    }
    // Otherwise, if flow completed without redirect, go home.
    if (!data) return;
    window.location.href = "/";
  } catch (e) {
    toast.error("Sign-in failed");
  }
}

function LoginPage() {
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();
  const [tab, setTab] = useState<"organizer" | "participant" | "jury">("organizer");

  useEffect(() => {
    if (loading || !user) return;
    if (role === "organizer") navigate({ to: "/organizer/dashboard" });
  }, [loading, user, role, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
        {/* LEFT — editorial intro */}
        <div className="relative hidden flex-col justify-between bg-beige p-12 lg:flex">
          <BeaconLogo />
          <div className="space-y-6 max-w-md">
            <div className="text-xs uppercase tracking-[0.22em] text-teal">Innovation Operating System</div>
            <h1 className="font-display text-5xl leading-[1.05] text-navy">
              The command center for student innovation.
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              From event creation to certificate delivery — Beacon HQ is the premium platform
              that powers hackathons across Hyderabad's leading institutions.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wider text-muted-foreground/80">
              
            </div>
          </div>
          <div className="text-xs text-muted-foreground italic font-display">
            "Illuminate. Empower. Transform."
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
          <div className="lg:hidden mb-8"><BeaconLogo /></div>
          <div className="mx-auto w-full max-w-md">
            <h2 className="font-display text-3xl text-navy">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose how you'd like to sign in.
            </p>

            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mt-8">
              <TabsList className="grid w-full grid-cols-3 bg-beige">
                <TabsTrigger value="organizer">Organizer</TabsTrigger>
                <TabsTrigger value="participant">Participant</TabsTrigger>
                <TabsTrigger value="jury">Jury</TabsTrigger>
              </TabsList>

              <TabsContent value="organizer" className="mt-6">
                <OrganizerForm />
              </TabsContent>
              <TabsContent value="participant" className="mt-6">
                <ParticipantForm />
              </TabsContent>
              <TabsContent value="jury" className="mt-6">
                <JuryForm />
              </TabsContent>
            </Tabs>

            <div className="mt-10 text-center text-xs text-muted-foreground">
              beacont.ai · Hyderabad
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrganizerForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ep = emailSchema.safeParse(email);
    if (!ep.success) { toast.error(ep.error.issues[0].message); return; }
    // Restrict organizer signups to company email by default, but allow existing
    // accounts to sign in. A dev env override `VITE_ALLOW_ORGANIZER_SIGNUP=true`
    // can be set to allow signup from other emails when working locally.
    const allowOrgSignup = import.meta.env.VITE_ALLOW_ORGANIZER_SIGNUP === "true";
    if (mode === "signup" && !ep.data.toLowerCase().endsWith("@beacont.ai") && !allowOrgSignup) {
      toast.error("Organizer access is restricted to Beacon Technologies staff.");
      return;
    }
    const pp = passwordSchema.safeParse(password);
    if (!pp.success) { toast.error(pp.error.issues[0].message); return; }

    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: ep.data, password: pp.data,
          options: {
            data: { full_name: name || ep.data.split("@")[0] },
            emailRedirectTo: `${window.location.origin}/organizer/dashboard`,
          },
        });
        if (error) throw error;
        toast.success("Account created. Redirecting…");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: ep.data, password: pp.data });
        if (error) throw error;
        toast.success("Signed in");
      }
      window.location.href = "/organizer/dashboard";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Or continue with</div>
        <div className="flex gap-2">
          <Button type="button" onClick={() => { setBusy(true); oauthSignIn("google", "organizer").finally(() => setBusy(false)); }} variant="outline" className="flex-1 h-9">Google</Button>
            <Button type="button" onClick={() => { setBusy(true); oauthSignIn("github", "organizer").finally(() => setBusy(false)); }} variant="outline" className="flex-1 h-9">GitHub</Button>
            <Button type="button" onClick={() => { setBusy(true); oauthSignIn("microsoft", "organizer").finally(() => setBusy(false)); }} variant="outline" className="flex-1 h-9">Microsoft</Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Restricted to <span className="text-navy font-medium">@beacont.ai</span> emails.
      </p>
      {mode === "signup" && (
        <div className="space-y-1.5">
          <Label htmlFor="org-name">Full name</Label>
          <Input id="org-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya Reddy" />
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="org-email">Work email</Label>
        <Input id="org-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@beacont.ai" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="org-pass">Password</Label>
        <Input id="org-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <Button type="submit" disabled={busy} className="w-full bg-navy text-background hover:bg-navy/90">
        {busy ? "Signing in…" : mode === "signin" ? "Sign in as Organizer" : "Create organizer account"}
      </Button>
      <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="block w-full text-center text-xs text-teal hover:underline">
        {mode === "signin" ? "New to Beacon HQ? Create an account →" : "Have an account? Sign in →"}
      </button>
    </form>
  );
}

function ParticipantForm() {
  const [busy, setBusy] = useState(false);
  // Uses module-level `oauthSignIn` helper; `busy` toggled by callers via UI
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Sign in with your college Google account to view your registration, leaderboard, and certificate.
      </p>
      <div className="flex flex-col gap-2">
        <Button onClick={() => { setBusy(true); oauthSignIn("google").finally(() => setBusy(false)); }} disabled={busy} variant="outline" className="w-full h-11 border-navy/20 hover:bg-beige">
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
          {busy ? "Connecting…" : "Continue with Google"}
        </Button>
        <Button onClick={() => { setBusy(true); oauthSignIn("github").finally(() => setBusy(false)); }} disabled={busy} variant="outline" className="w-full h-11 border-navy/20 hover:bg-beige">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.75-1.56-2.56-.29-5.26-1.28-5.26-5.71 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.52.11-3.17 0 0 .98-.31 3.2 1.19a11.06 11.06 0 0 1 2.92-.39c.99.01 1.99.13 2.92.39 2.22-1.5 3.2-1.19 3.2-1.19.63 1.65.23 2.87.11 3.17.75.81 1.2 1.84 1.2 3.1 0 4.44-2.7 5.41-5.28 5.7.42.36.8 1.08.8 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/></svg>
          Continue with GitHub
        </Button>
        <Button onClick={() => { setBusy(true); oauthSignIn("microsoft").finally(() => setBusy(false)); }} disabled={busy} variant="outline" className="w-full h-11 border-navy/20 hover:bg-beige">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="#f1511b" d="M1 1h10v10H1z"/><path fill="#00a4ef" d="M13 1h10v10H13z"/><path fill="#ffb900" d="M1 13h10v10H1z"/><path fill="#7fba00" d="M13 13h10v10H13z"/></svg>
          Continue with Microsoft
        </Button>
      </div>
    </div>
  );
}

function JuryForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  async function send(e: React.FormEvent) {
    e.preventDefault();
    const ep = emailSchema.safeParse(email);
    if (!ep.success) { toast.error(ep.error.issues[0].message); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: ep.data,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      if (error) throw error;
      toast.success("Magic link sent. Check your inbox.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send magic link");
    } finally { setBusy(false); }
  }
  return (
    <form onSubmit={send} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter the email where you received your invite. We'll send you a one-time sign-in link.
      </p>
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Or sign in with</div>
        <div className="flex gap-2">
          <Button type="button" onClick={() => { setBusy(true); oauthSignIn("google").finally(() => setBusy(false)); }} variant="outline" className="flex-1 h-9">Google</Button>
          <Button type="button" onClick={() => { setBusy(true); oauthSignIn("github").finally(() => setBusy(false)); }} variant="outline" className="flex-1 h-9">GitHub</Button>
          <Button type="button" onClick={() => { setBusy(true); oauthSignIn("microsoft").finally(() => setBusy(false)); }} variant="outline" className="flex-1 h-9">Microsoft</Button>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="jury-email">Invite email</Label>
        <Input id="jury-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="dr.you@university.edu" required />
      </div>
      <Button type="submit" disabled={busy} className="w-full bg-navy text-background hover:bg-navy/90">
        {busy ? "Sending…" : "Send sign-in link"}
      </Button>
    </form>
  );
}