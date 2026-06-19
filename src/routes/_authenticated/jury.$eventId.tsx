import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { BeaconLogo } from "@/components/beacon/logo";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/_authenticated/jury/$eventId")({
  component: JuryPortal,
});

function JuryPortal() {
  const { eventId } = Route.useParams();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["jury-portal", eventId, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [{ data: event }, { data: jm }, { data: subs }, { data: criteria }] = await Promise.all([
        supabase.from("events").select("*").eq("id", eventId).maybeSingle(),
        supabase.from("jury_members").select("*").eq("event_id", eventId).eq("user_id", user!.id).maybeSingle(),
        supabase.from("submissions").select("*, teams(name, college)").eq("event_id", eventId),
        supabase.from("judging_criteria").select("*").eq("event_id", eventId).order("sort_order"),
      ]);
      // If not linked yet, try linking via email
      if (!jm) {
        const { data: byEmail } = await supabase.from("jury_members").select("*").eq("event_id", eventId).eq("email", user!.email!.toLowerCase()).maybeSingle();
        if (byEmail && !byEmail.user_id) {
          await supabase.from("jury_members").update({ user_id: user!.id, invite_status: "logged_in", last_seen_at: new Date().toISOString() }).eq("id", byEmail.id);
          return { event, jm: byEmail, subs: subs ?? [], criteria: criteria ?? [] };
        }
      } else {
        await supabase.from("jury_members").update({ invite_status: "logged_in", last_seen_at: new Date().toISOString() }).eq("id", jm.id);
      }
      return { event, jm, subs: subs ?? [], criteria: criteria ?? [] };
    },
  });

  const { data: scores } = useQuery({
    queryKey: ["jury-scores", eventId, data?.jm?.id],
    enabled: !!data?.jm,
    queryFn: async () => {
      const { data: s } = await supabase.from("scores").select("*").eq("jury_member_id", data!.jm!.id);
      return s ?? [];
    },
  });

  const [active, setActive] = useState<string | null>(null);
  useEffect(() => { if (data?.subs.length && !active) setActive(data.subs[0].id); }, [data, active]);

  if (isLoading) return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading judging panel…</div>;
  if (!data?.event) return null;

  if (!data.jm) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h2 className="font-display text-2xl text-navy">This invite isn't for you</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">Your account isn't listed as a jury member for this event. Please use the invite email sent to your inbox.</p>
        <Button onClick={() => navigate({ to: "/login" })} className="mt-6 bg-navy text-background hover:bg-navy/90">Back to sign in</Button>
      </div>
    );
  }

  if (!data.event.judging_open) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <BeaconLogo />
        <h2 className="mt-8 font-display text-2xl text-navy">Judging hasn't opened yet</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">You'll receive a notification when it's time to score. You can close this tab for now.</p>
      </div>
    );
  }

  const scoredIds = new Set((scores ?? []).map((s) => s.submission_id));
  const total = data.subs.length;
  const done = data.subs.filter((s: any) => scoredIds.has(s.id)).length;
  const activeSub = data.subs.find((s: any) => s.id === active);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <BeaconLogo />
          <div className="hidden sm:block text-xs text-muted-foreground">Judging panel · <span className="text-navy">{data.event.name}</span></div>
          <Button variant="ghost" size="sm" onClick={signOut}>Sign out</Button>
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-4">
          <div className="text-xs text-muted-foreground">You've scored {done} of {total}</div>
          <div className="mt-1.5 h-1 rounded-full bg-beige overflow-hidden"><div className="h-full bg-navy transition-[width]" style={{ width: `${(done / Math.max(total, 1)) * 100}%` }} /></div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-1.5 lg:sticky lg:top-6 lg:h-fit">
          {data.subs.map((s: any) => {
            const ok = scoredIds.has(s.id);
            return (
              <button key={s.id} onClick={() => setActive(s.id)}
                className={`block w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${active === s.id ? "bg-beige border-navy" : "bg-card hover:bg-beige/40"}`}>
                <div className="text-navy font-medium truncate">{s.project_name}</div>
                <div className="mt-0.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="truncate">{s.teams?.name}</span>
                  <span className={ok ? "text-success" : "text-muted-foreground"}>{ok ? "Scored ✓" : "Pending"}</span>
                </div>
              </button>
            );
          })}
        </aside>

        {activeSub && data.jm && (
          <ScoreForm key={activeSub.id} submission={activeSub} criteria={data.criteria} juryMemberId={data.jm.id} scores={scores ?? []} />
        )}
      </div>
    </div>
  );
}

function ScoreForm({ submission, criteria, juryMemberId, scores }: any) {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, number>>(() => {
    const out: Record<string, number> = {};
    for (const c of criteria) {
      const existing = scores.find((s: any) => s.submission_id === submission.id && s.criteria_id === c.id);
      out[c.id] = existing ? Number(existing.points) : 0;
    }
    return out;
  });
  const [notes, setNotes] = useState(() => {
    const any = scores.find((s: any) => s.submission_id === submission.id);
    return any?.notes ?? "";
  });
  const [busy, setBusy] = useState(false);

  const total = Object.values(values).reduce((a, b) => a + (b || 0), 0);

  async function save() {
    setBusy(true);
    try {
      const rows = criteria.map((c: any) => ({
        submission_id: submission.id, jury_member_id: juryMemberId, criteria_id: c.id,
        points: values[c.id] ?? 0, notes,
      }));
      const { error } = await supabase.from("scores").upsert(rows, { onConflict: "submission_id,jury_member_id,criteria_id" });
      if (error) throw error;
      toast.success("Score saved");
      qc.invalidateQueries({ queryKey: ["jury-scores"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally { setBusy(false); }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 shadow-card">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{submission.teams?.name} · {submission.teams?.college}</div>
        <h2 className="mt-1 font-display text-2xl text-navy">{submission.project_name}</h2>
        {submission.description && <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{submission.description}</p>}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {submission.github_url && <a href={submission.github_url} target="_blank" rel="noreferrer" className="rounded-full bg-beige px-3 py-1 text-navy hover:bg-sky">GitHub</a>}
          {submission.demo_url && <a href={submission.demo_url} target="_blank" rel="noreferrer" className="rounded-full bg-beige px-3 py-1 text-navy hover:bg-sky">Demo</a>}
          {submission.slides_url && <a href={submission.slides_url} target="_blank" rel="noreferrer" className="rounded-full bg-beige px-3 py-1 text-navy hover:bg-sky">Slides</a>}
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-card space-y-5">
        {criteria.map((c: any) => (
          <div key={c.id} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-navy font-medium">{c.name}</span>
              <span className="text-muted-foreground tabular-nums">{values[c.id] ?? 0} / {c.max_points}</span>
            </div>
            <Slider value={[values[c.id] ?? 0]} max={c.max_points} step={1} onValueChange={(v) => setValues({ ...values, [c.id]: v[0] })} />
          </div>
        ))}
        <div className="border-t pt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Total</div>
          <div className="font-display text-2xl text-navy tabular-nums">{total}</div>
        </div>
        <Textarea placeholder="Notes for the team (optional)…" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        <Button disabled={busy} onClick={save} className="w-full bg-navy text-background hover:bg-navy/90">{busy ? "Saving…" : "Save score"}</Button>
      </div>
    </div>
  );
}