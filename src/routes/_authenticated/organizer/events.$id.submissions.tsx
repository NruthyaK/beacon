import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlaceholderTab } from "@/components/beacon/placeholder-tab";
import { EmptyState } from "@/components/beacon/empty-state";
import { ListChecks, Github, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_authenticated/organizer/events/$id/submissions")({
  component: SubmissionsPage,
});

const statusStyle: Record<string, string> = {
  valid: "bg-success/15 text-success",
  pending: "bg-warning/15 text-[oklch(0.45_0.10_70)]",
  flagged: "bg-destructive/15 text-destructive",
  incomplete: "bg-muted text-muted-foreground border-dashed",
};

function SubmissionsPage() {
  const { id } = Route.useParams();
  const { data } = useQuery({
    queryKey: ["subs", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("submissions")
        .select("*, teams(name, college)")
        .eq("event_id", id);
      return data ?? [];
    },
  });

  return (
    <PlaceholderTab title="Submissions" lead="Project submissions with automated validation checks.">
      {!data || data.length === 0 ? (
        <EmptyState icon={<ListChecks className="h-5 w-5" />} title="No submissions yet" description="Submissions appear here as teams upload their work." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.map((s: any) => (
            <div key={s.id} className="rounded-2xl border bg-card p-6 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-lg text-navy">{s.project_name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.teams?.name} · {s.teams?.college}</div>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider ${statusStyle[s.status] || ""}`}>
                  {s.status}{s.is_late && " · LATE"}
                </span>
              </div>
              {s.description && <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{s.description}</p>}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {s.github_url && <a href={s.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-beige px-2.5 py-1 text-navy hover:bg-sky"><Github className="h-3 w-3" /> Repo</a>}
                {s.demo_url && <a href={s.demo_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-beige px-2.5 py-1 text-navy hover:bg-sky"><ExternalLink className="h-3 w-3" /> Demo</a>}
                {s.slides_url && <a href={s.slides_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-beige px-2.5 py-1 text-navy hover:bg-sky"><ExternalLink className="h-3 w-3" /> Slides</a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </PlaceholderTab>
  );
}