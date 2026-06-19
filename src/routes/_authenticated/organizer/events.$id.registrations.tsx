import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlaceholderTab } from "@/components/beacon/placeholder-tab";
import { EmptyState } from "@/components/beacon/empty-state";
import { Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/organizer/events/$id/registrations")({
  component: RegistrationsPage,
});

function RegistrationsPage() {
  const { id } = Route.useParams();
  const { data: members } = useQuery({
    queryKey: ["regs", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("team_members")
        .select("*, teams!inner(name, event_id, college)")
        .eq("teams.event_id", id);
      return data ?? [];
    },
  });

  return (
    <PlaceholderTab title="Registrations" lead="Every participant who joined a team for this event.">
      {!members || members.length === 0 ? (
        <EmptyState icon={<Users className="h-5 w-5" />} title="No registrations yet"
          description="Once teams sign up, they'll appear here with college and team breakdown." />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
          <table className="w-full">
            <thead className="bg-beige/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Team</th>
                <th className="px-6 py-4">College</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {members.map((m: any) => (
                <tr key={m.id} className="text-sm">
                  <td className="px-6 py-4 text-navy">{m.full_name}{m.is_lead && <span className="ml-2 text-[10px] uppercase tracking-wider text-teal">Lead</span>}</td>
                  <td className="px-6 py-4 text-muted-foreground">{m.email}</td>
                  <td className="px-6 py-4 text-muted-foreground">{m.teams?.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{m.college || m.teams?.college || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PlaceholderTab>
  );
}