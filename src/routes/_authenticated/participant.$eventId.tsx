import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { BeaconLogo } from "@/components/beacon/logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/participant/$eventId")({
  component: ParticipantView,
});

function ParticipantView() {
  const { eventId } = Route.useParams();
  const { user, signOut } = useAuth();
  const { data } = useQuery({
    queryKey: ["p-event", eventId, user?.id],
    queryFn: async () => {
      const [{ data: event }, { data: problems }] = await Promise.all([
        supabase.from("events").select("*").eq("id", eventId).maybeSingle(),
        supabase.from("problem_statements").select("*").eq("event_id", eventId),
      ]);
      return { event, problems: problems ?? [] };
    },
  });

  if (!data?.event) return null;
  const { event, problems } = data;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <BeaconLogo />
          <Button variant="ghost" size="sm" onClick={signOut}>Sign out</Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-12 space-y-10">
        <section>
          <div className="text-xs uppercase tracking-[0.2em] text-teal">{event.college}</div>
          <h1 className="mt-2 font-display text-4xl text-navy">{event.name}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Event date: {new Date(event.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            {event.venue ? ` · ${event.venue}` : ""}
          </p>
        </section>

        {event.welcome_message && (
          <section className="rounded-2xl border bg-beige/40 p-6">
            <p className="font-display text-lg text-navy leading-relaxed">{event.welcome_message}</p>
          </section>
        )}

        <section>
          <h2 className="font-display text-xl text-navy">Problem statements</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {problems.map((p: any) => (
              <div key={p.id} className="rounded-2xl border bg-card p-5 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg text-navy">{p.title}</h3>
                  <span className="rounded-full bg-beige px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{p.difficulty}</span>
                </div>
                {p.description && <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}