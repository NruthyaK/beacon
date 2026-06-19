import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { HYDERABAD_COLLEGES, DEFAULT_CRITERIA } from "@/lib/colleges";
import { OrganizerShell, RequireRole } from "@/components/beacon/organizer-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/organizer/events/new")({
  component: () => (
    <RequireRole role="organizer">
      <OrganizerShell><NewEvent /></OrganizerShell>
    </RequireRole>
  ),
});

type Problem = { title: string; description: string; difficulty: "easy" | "medium" | "hard" };
type Criterion = { name: string; max_points: number };

const schema = z.object({
  name: z.string().trim().min(3, "Event name is required").max(80),
  college: z.string().trim().min(2, "College is required").max(120),
  event_date: z.string().min(1, "Event date is required"),
  registration_deadline: z.string().min(1),
  submission_deadline: z.string().min(1),
  venue: z.string().trim().max(160).optional(),
  max_team_size: z.number().int().min(1).max(6),
  max_participants: z.number().int().min(1).max(10_000).optional(),
  welcome_message: z.string().trim().max(800).optional(),
});

function NewEvent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);

  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [regDeadline, setRegDeadline] = useState("");
  const [subDeadline, setSubDeadline] = useState("");
  const [venue, setVenue] = useState("");
  const [maxTeam, setMaxTeam] = useState(4);
  const [maxParticipants, setMaxParticipants] = useState<number | "">("");
  const [welcome, setWelcome] = useState("");

  const [problems, setProblems] = useState<Problem[]>([
    { title: "", description: "", difficulty: "medium" },
  ]);
  const [criteria, setCriteria] = useState<Criterion[]>(DEFAULT_CRITERIA);

  const criteriaTotal = criteria.reduce((s, c) => s + (Number(c.max_points) || 0), 0);

  async function submit(action: "draft" | "publish") {
    if (!user) return;
    const parsed = schema.safeParse({
      name, college, event_date: eventDate,
      registration_deadline: regDeadline, submission_deadline: subDeadline,
      venue: venue || undefined, max_team_size: maxTeam,
      max_participants: maxParticipants ? Number(maxParticipants) : undefined,
      welcome_message: welcome || undefined,
    });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }

    const now = new Date();
    const evDate = new Date(eventDate);
    const regD = new Date(regDeadline);
    const subD = new Date(subDeadline);

    if (evDate < now) { toast.error("Please choose a future date."); return; }
    if (regD > subD) { toast.error("Registration deadline must be before the submission deadline."); return; }
    if (subD > evDate) { toast.error("Submission deadline must be before the event date."); return; }

    const validProblems = problems.filter((p) => p.title.trim());
    if (action === "publish" && validProblems.length === 0) {
      toast.error("Add at least one problem statement before publishing.");
      return;
    }
    const validCriteria = criteria.filter((c) => c.name.trim() && Number(c.max_points) > 0);
    if (action === "publish" && validCriteria.length === 0) {
      toast.error("Add at least one judging criterion before publishing.");
      return;
    }
    if (action === "publish" && criteriaTotal > 100) {
      toast.error("Total exceeds 100 points. Adjust your criteria weights.");
      return;
    }

    setBusy(true);
    try {
      const { data: event, error } = await supabase
        .from("events")
        .insert({
          organizer_id: user.id,
          name: parsed.data.name,
          college: parsed.data.college,
          venue: parsed.data.venue,
          event_date: parsed.data.event_date,
          registration_deadline: regD.toISOString(),
          submission_deadline: subD.toISOString(),
          max_team_size: parsed.data.max_team_size,
          max_participants: parsed.data.max_participants,
          welcome_message: parsed.data.welcome_message,
          status: action === "publish" ? "upcoming" : "draft",
        })
        .select()
        .single();
      if (error) throw error;

      if (validProblems.length) {
        await supabase.from("problem_statements").insert(
          validProblems.map((p) => ({ event_id: event.id, ...p })),
        );
      }
      if (validCriteria.length) {
        await supabase.from("judging_criteria").insert(
          validCriteria.map((c, i) => ({ event_id: event.id, name: c.name, max_points: Number(c.max_points), sort_order: i })),
        );
      }
      toast.success(action === "publish" ? `${event.name} is live!` : "Saved as draft.");
      navigate({ to: `/organizer/events/${event.id}` as string });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create event");
    } finally { setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-12">
      <header className="space-y-3">
        <div className="text-xs uppercase tracking-[0.22em] text-teal">New event</div>
        <h1 className="font-display text-4xl text-navy">Create a hackathon</h1>
        <p className="text-sm text-muted-foreground">Five sections. You can save a draft any time and finish later.</p>
      </header>

      {/* Section A */}
      <section className="space-y-5">
        <SectionHeader index="A" title="Event basics" />
        <Field label={`Event name (${name.length}/80)`}>
          <Input value={name} maxLength={80} onChange={(e) => setName(e.target.value)} placeholder="Innovate AI Hackathon 2026" />
        </Field>
        <Field label="College / Host institution">
          <Input list="colleges" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="CBIT" />
          <datalist id="colleges">{HYDERABAD_COLLEGES.map((c) => <option key={c} value={c} />)}</datalist>
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Event date">
            <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          </Field>
          <Field label="Registration deadline">
            <Input type="datetime-local" value={regDeadline} onChange={(e) => setRegDeadline(e.target.value)} />
          </Field>
          <Field label="Submission deadline">
            <Input type="datetime-local" value={subDeadline} onChange={(e) => setSubDeadline(e.target.value)} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Venue (optional)">
            <Input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Main auditorium" />
          </Field>
          <Field label="Max team size">
            <Select value={String(maxTeam)} onValueChange={(v) => setMaxTeam(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Max participants (optional)">
            <Input type="number" min={1} value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value ? Number(e.target.value) : "")} placeholder="e.g. 200" />
          </Field>
        </div>
      </section>

      {/* Section B */}
      <section className="space-y-5">
        <SectionHeader index="B" title="Problem statements" />
        <div className="space-y-4">
          {problems.map((p, i) => (
            <div key={i} className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Problem {i + 1}</div>
                {problems.length > 1 && (
                  <button onClick={() => setProblems(problems.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <Input value={p.title} placeholder="Title" onChange={(e) => {
                  const nx = [...problems]; nx[i] = { ...p, title: e.target.value }; setProblems(nx);
                }} />
                <Textarea value={p.description} placeholder="Describe the problem and expected outcome…" rows={3} onChange={(e) => {
                  const nx = [...problems]; nx[i] = { ...p, description: e.target.value }; setProblems(nx);
                }} />
                <Select value={p.difficulty} onValueChange={(v) => {
                  const nx = [...problems]; nx[i] = { ...p, difficulty: v as Problem["difficulty"] }; setProblems(nx);
                }}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={() => setProblems([...problems, { title: "", description: "", difficulty: "medium" }])}>
            <Plus className="mr-2 h-4 w-4" /> Add problem statement
          </Button>
        </div>
      </section>

      {/* Section C */}
      <section className="space-y-5">
        <SectionHeader index="C" title="Judging criteria" />
        <div className="space-y-3">
          {criteria.map((c, i) => (
            <div key={i} className="flex items-center gap-3">
              <Input className="flex-1" value={c.name} placeholder="Criterion name" onChange={(e) => {
                const nx = [...criteria]; nx[i] = { ...c, name: e.target.value }; setCriteria(nx);
              }} />
              <Input className="w-28" type="number" min={0} max={100} value={c.max_points} onChange={(e) => {
                const nx = [...criteria]; nx[i] = { ...c, max_points: Number(e.target.value) || 0 }; setCriteria(nx);
              }} />
              <span className="text-xs text-muted-foreground w-10">pts</span>
              <button onClick={() => setCriteria(criteria.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" size="sm" onClick={() => setCriteria([...criteria, { name: "", max_points: 0 }])}>
              <Plus className="mr-2 h-4 w-4" /> Add criterion
            </Button>
            <div className={`text-sm tabular-nums ${criteriaTotal === 100 ? "text-success" : criteriaTotal > 100 ? "text-destructive" : "text-muted-foreground"}`}>
              Total: <span className="font-semibold">{criteriaTotal}</span> / 100 points
            </div>
          </div>
        </div>
      </section>

      {/* Section E */}
      <section className="space-y-5">
        <SectionHeader index="D" title="Branding & welcome" />
        <Field label="Welcome message (optional)">
          <Textarea value={welcome} maxLength={800} onChange={(e) => setWelcome(e.target.value)} rows={4}
            placeholder="Welcome teams! Here's what to expect on event day…" />
        </Field>
      </section>

      <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-end gap-3 rounded-2xl border bg-card p-4 shadow-elevated">
        <Button variant="ghost" onClick={() => navigate({ to: "/organizer/events" })}>Cancel</Button>
        <Button variant="outline" onClick={() => submit("draft")} disabled={busy}>Save as draft</Button>
        <Button onClick={() => submit("publish")} disabled={busy} className="bg-navy text-background hover:bg-navy/90">
          {busy ? "Publishing…" : "Publish event"}
        </Button>
      </div>
    </div>
  );
}

function SectionHeader({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-beige font-display text-sm text-navy">{index}</div>
      <h2 className="font-display text-xl text-navy">{title}</h2>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}