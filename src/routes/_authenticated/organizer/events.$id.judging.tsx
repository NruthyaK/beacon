import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PlaceholderTab } from "@/components/beacon/placeholder-tab";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/organizer/events/$id/judging")({
  component: JudgingPage,
});

function JudgingPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["judging", id],
    queryFn: async () => {
      const [{ data: event }, { data: subs }, { data: jury }, { data: scores }, { data: criteria }] = await Promise.all([
        supabase.from("events").select("*").eq("id", id).maybeSingle(),
        supabase.from("submissions").select("id, project_name, teams(name)").eq("event_id", id),
        supabase.from("jury_members").select("id, full_name").eq("event_id", id),
        supabase.from("scores").select("submission_id, jury_member_id, points"),
        supabase.from("judging_criteria").select("*").eq("event_id", id),
      ]);
      return { event, subs: subs ?? [], jury: jury ?? [], scores: scores ?? [], criteria: criteria ?? [] };
    },
  });

  async function toggleJudging(open: boolean) {
    if (open) {
      if (!data?.jury.length) { toast.error("Add at least one jury member first."); return; }
      if (!data?.subs.length) { toast.error("No submissions to judge yet."); return; }
    }
    await supabase.from("events").update({ judging_open: open, status: open ? "judging" : "completed" }).eq("id", id);
    toast.success(open ? "Judging opened" : "Judging closed");
    qc.invalidateQueries({ queryKey: ["judging", id] });
    qc.invalidateQueries({ queryKey: ["event", id] });
  }

  const judgingOpen = data?.event?.judging_open;

  return (
    <PlaceholderTab title="Judging" lead="Aggregate jury view. Open the phase to let jury start scoring; close it to finalize.">
      <div className="flex flex-wrap items-center gap-3">
        {!judgingOpen ? (
          <Button onClick={() => toggleJudging(true)} className="bg-navy text-background hover:bg-navy/90">Open judging phase</Button>
        ) : (
          <Button onClick={() => toggleJudging(false)} variant="outline">Close judging & finalize</Button>
        )}
      </div>

      {data && data.subs.length > 0 && data.jury.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border bg-card shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-beige/60 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Project</th>
                {data.jury.map((j) => <th key={j.id} className="px-4 py-3 text-center">{j.full_name.split(" ")[0]}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.subs.map((s: any) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 text-navy">{s.project_name}<div className="text-xs text-muted-foreground">{s.teams?.name}</div></td>
                  {data.jury.map((j) => {
                    const cellScores = data.scores.filter((x: any) => x.submission_id === s.id && x.jury_member_id === j.id);
                    const total = cellScores.reduce((a: number, b: any) => a + Number(b.points), 0);
                    return (
                      <td key={j.id} className={`px-4 py-3 text-center tabular-nums ${cellScores.length ? "text-navy font-medium" : "text-muted-foreground"}`}>
                        {cellScores.length ? total : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PlaceholderTab>
  );
}