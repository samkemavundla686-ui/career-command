import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { useStore, type ActivityType } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Activity — Career Command Centre" },
      { name: "description", content: "Your full career activity timeline." },
    ],
  }),
  component: ActivityPage,
});

const typeColor: Record<ActivityType, string> = {
  application_created: "bg-primary",
  application_updated: "bg-chart-2",
  application_submitted: "bg-primary",
  status_changed: "bg-chart-3",
  company_added: "bg-chart-4",
  company_responded: "bg-primary",
  interview_scheduled: "bg-primary",
  interview_completed: "bg-success",
  task_created: "bg-chart-2",
  task_completed: "bg-success",
  document_uploaded: "bg-chart-4",
  note_added: "bg-muted-foreground",
  follow_up_sent: "bg-warning",
  deadline_changed: "bg-warning",
};

function ActivityPage() {
  const activities = useStore((s) => s.activities);
  const [q, setQ] = useState("");

  const grouped = useMemo(() => {
    const filt = activities.filter((a) => !q || a.message.toLowerCase().includes(q.toLowerCase()));
    const map = new Map<string, typeof activities>();
    filt.forEach((a) => {
      const k = a.at.slice(0, 10);
      const arr = map.get(k) ?? [];
      arr.push(a);
      map.set(k, arr);
    });
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [activities, q]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      <PageHeader title="Activity History" description={`${activities.length} actions logged`} />
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search activity…" className="pl-9" />
      </div>

      <div className="space-y-6">
        {grouped.map(([day, items]) => (
          <section key={day}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {format(new Date(day), "EEEE, MMMM d, yyyy")}
            </h2>
            <ol className="relative space-y-3 border-l border-border pl-6">
              {items.map((a) => (
                <li key={a.id} className="relative">
                  <span className={cn("absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-background", typeColor[a.type])} />
                  <div className="rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/40">
                    <p className="text-sm">{a.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDistanceToNow(new Date(a.at), { addSuffix: true })} · {a.type.replace(/_/g, " ")}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
        {grouped.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">No matching activity.</p>}
      </div>
    </div>
  );
}
