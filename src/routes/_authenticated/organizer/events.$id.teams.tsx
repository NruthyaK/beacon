import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlaceholderTab } from "@/components/beacon/placeholder-tab";
import { EmptyState } from "@/components/beacon/empty-state";
import { UsersRound } from "lucide-react";

export const Route = createFileRoute("/_authenticated/organizer/events/$id/teams")({
  component: TeamsPage,
});

function TeamsPage() {
  const { id } = Route.useParams();
  const { data } = useQuery({
    queryKey: ["teams", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("teams")
        .select("*, team_members(*), problem_statements(title)")
        .eq("event_id", id);
      return data ?? [];
    },
  });

  return (
    <PlaceholderTab title="Teams" lead="All teams competing in this event.">
      {!data || data.length === 0 ? (
        <EmptyState icon={<UsersRound className="h-5 w-5" />} title="No teams yet" description="Teams will appear as they form during registration." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((t: any) => (
            <div key={t.id} className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="font-display text-lg text-navy">{t.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{t.college || "—"}</div>
              {t.problem_statements?.title && (
                <div className="mt-3 text-xs"><span className="text-muted-foreground">Working on: </span><span className="text-navy">{t.problem_statements.title}</span></div>
              )}
              <div className="mt-4 border-t pt-3 text-xs text-muted-foreground">{t.team_members?.length ?? 0} members</div>
            </div>
          ))}
        </div>
      )}
    </PlaceholderTab>
  );
}