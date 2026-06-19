import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderTab } from "@/components/beacon/placeholder-tab";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/organizer/events/$id/certificates")({
  component: CertsPage,
});

function CertsPage() {
  const { id } = Route.useParams();
  return (
    <PlaceholderTab title="Certificates" lead="Generate elegant participation and winner certificates with the Beacon brand mark.">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <CertificatePreview />
        <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-card">
          <h3 className="font-display text-lg text-navy">Bulk actions</h3>
          <p className="text-sm text-muted-foreground">Finalize judging first, then issue winners' certificates.</p>
          <Button onClick={() => toast.success("Certificates queued (demo)")} className="w-full bg-navy text-background hover:bg-navy/90">
            <Award className="mr-2 h-4 w-4" /> Generate participation certificates
          </Button>
          <Button variant="outline" onClick={() => toast.info("Finalize the leaderboard before sending winner certificates.")} className="w-full">
            Send winners only
          </Button>
        </div>
      </div>
    </PlaceholderTab>
  );
}

function CertificatePreview() {
  return (
    <div className="rounded-2xl border-2 border-navy/10 bg-[oklch(0.99_0.005_70)] p-12 shadow-card">
      <div className="flex items-start justify-between text-xs uppercase tracking-[0.22em] text-navy">
        <span>Beacon Technologies</span>
        <span>UptoSkills · Verified</span>
      </div>
      <div className="mt-12 text-center space-y-4">
        <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Certificate of Recognition</div>
        <div className="font-display text-5xl text-navy">[Recipient Name]</div>
        <div className="editorial-divider mx-auto w-32" />
        <p className="mx-auto max-w-md text-sm text-muted-foreground leading-relaxed">
          For distinguished participation in <span className="text-navy font-medium">[Event Name]</span>,
          hosted at <span className="text-navy">[College]</span> on <span className="text-navy">[Date]</span>.
        </p>
      </div>
      <div className="mt-12 flex items-end justify-between text-xs text-muted-foreground">
        <div>Issued by Beacon Technologies, Hyderabad</div>
        <div className="font-display italic text-navy">Illuminate. Empower. Transform.</div>
      </div>
    </div>
  );
}