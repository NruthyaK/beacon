import { Button } from "@/components/ui/button";

export default function EventCard({ title, date, location, description, to }: { title: string; date: string; location: string; description: string; to: string }) {
  return (
    <article className="rounded-lg border p-4 bg-background">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-navy">{title}</h3>
          <div className="mt-1 text-sm text-muted-foreground">{date} · {location}</div>
        </div>
        <div className="shrink-0">
          <a href={to}><Button variant="outline">View</Button></a>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
    </article>
  );
}
