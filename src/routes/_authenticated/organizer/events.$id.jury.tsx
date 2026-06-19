import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/organizer/events/$id/jury")({
  component: JuryPage,
});

const schema = z.object({
  full_name: z.string().trim().min(2, "Full name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  designation: z.string().trim().max(120).optional(),
  organization: z.string().trim().max(120).optional(),
});

function JuryPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [organization, setOrganization] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const { data: jury } = useQuery({
    queryKey: ["jury", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("jury_members").select("*").eq("event_id", id).order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });

  async function add() {
    const parsed = schema.safeParse({ full_name: fullName, email, designation: designation || undefined, organization: organization || undefined });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setBusy(true);
    try {
      const { error } = await supabase.from("jury_members").insert({
        event_id: id,
        full_name: parsed.data.full_name,
        email: parsed.data.email.toLowerCase(),
        designation: parsed.data.designation,
        organization: parsed.data.organization,
        expertise: tags,
      });
      if (error) {
        if (error.message.includes("duplicate")) toast.error("This person is already added as a jury member.");
        else throw error;
        return;
      }
      toast.success("Jury member added");
      setFullName(""); setEmail(""); setDesignation(""); setOrganization(""); setTags([]);
      qc.invalidateQueries({ queryKey: ["jury", id] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add jury member");
    } finally { setBusy(false); }
  }

  async function sendInvite(jm: any) {
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: jm.email,
        options: { emailRedirectTo: `${window.location.origin}/jury/${id}` },
      });
      if (error) throw error;
      await supabase.from("jury_members").update({ invite_status: "sent", invite_sent_at: new Date().toISOString() }).eq("id", jm.id);
      toast.success(`Invite sent to ${jm.email}`);
      qc.invalidateQueries({ queryKey: ["jury", id] });
    } catch (err) {
      await supabase.from("jury_members").update({ invite_status: "failed" }).eq("id", jm.id);
      toast.error("Invite failed. Check the email address.");
      qc.invalidateQueries({ queryKey: ["jury", id] });
    } finally { setBusy(false); }
  }

  async function remove(jm: any) {
    if (!confirm(`Remove ${jm.full_name}? This cannot be undone.`)) return;
    await supabase.from("jury_members").delete().eq("id", jm.id);
    toast.success("Jury member removed");
    qc.invalidateQueries({ queryKey: ["jury", id] });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      {/* LEFT */}
      <section className="rounded-2xl border bg-card p-6 shadow-card h-fit">
        <h2 className="font-display text-xl text-navy">Add jury member</h2>
        <p className="mt-1 text-sm text-muted-foreground">Send a magic link they can use to log in and judge.</p>
        <div className="mt-5 space-y-4">
          <FieldRow label="Full name *"><Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Dr. Priya Nair" /></FieldRow>
          <FieldRow label="Email *"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="priya@university.edu" /></FieldRow>
          <FieldRow label="Designation"><Input value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Senior AI Engineer" /></FieldRow>
          <FieldRow label="Organization"><Input value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="Microsoft Research" /></FieldRow>
          <FieldRow label="Expertise tags">
            <div>
              <div className="flex gap-2">
                <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="AI/ML"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const t = tagInput.trim(); if (t && !tags.includes(t)) setTags([...tags, t]);
                      setTagInput("");
                    }
                  }} />
                <Button type="button" variant="outline" onClick={() => {
                  const t = tagInput.trim(); if (t && !tags.includes(t)) setTags([...tags, t]); setTagInput("");
                }}>Add</Button>
              </div>
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 rounded-full bg-sky/40 px-2.5 py-0.5 text-xs text-navy">
                      {t}
                      <button onClick={() => setTags(tags.filter((x) => x !== t))}><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </FieldRow>
          <Button disabled={busy} onClick={add} className="w-full bg-navy text-background hover:bg-navy/90">Add jury member</Button>
        </div>
      </section>

      {/* RIGHT */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-navy">Jury panel ({jury?.length ?? 0})</h2>
        </div>
        {!jury || jury.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card/40 p-12 text-center">
            <p className="text-sm text-muted-foreground">No jury added yet. Add the first member on the left.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {jury.map((j) => (
              <article key={j.id} className="rounded-2xl border bg-card p-5 shadow-card">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-beige font-display text-base text-navy">
                    {j.full_name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-base text-navy truncate">{j.full_name}</div>
                    <div className="text-xs text-muted-foreground truncate">{j.designation || "—"}{j.organization ? ` · ${j.organization}` : ""}</div>
                    <div className="text-xs text-muted-foreground truncate mt-0.5">{j.email}</div>
                  </div>
                </div>
                {j.expertise && j.expertise.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {j.expertise.map((t: string) => (
                      <span key={t} className="rounded-full bg-sky/30 px-2 py-0.5 text-[10px] text-navy">{t}</span>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <InviteBadge status={j.invite_status} />
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => sendInvite(j)}><Mail className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(j)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function InviteBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    pending:    ["Pending", "bg-muted text-muted-foreground"],
    sent:       ["Invite Sent", "bg-sky/40 text-navy"],
    opened:     ["Link Opened", "bg-teal/15 text-teal"],
    logged_in:  ["Logged In", "bg-success/15 text-success"],
    completed:  ["Scoring Complete", "bg-success/25 text-success"],
    failed:     ["Invite Failed", "bg-destructive/15 text-destructive"],
  };
  const [label, cls] = map[status] || map.pending;
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider ${cls}`}>{label}</span>;
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}