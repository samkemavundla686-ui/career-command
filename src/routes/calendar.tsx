import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek, isSameMonth } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { TaskFormDialog } from "@/components/task-form-dialog";
import { useStore, getCompany } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Shemove Hub" },
      { name: "description", content: "Deadlines, interviews, follow-ups and tasks in one calendar." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const [month, setMonth] = useState(new Date());
  const apps = useStore((s) => s.applications);
  const interviews = useStore((s) => s.interviews);
  const tasks = useStore((s) => s.tasks);

  const events = useMemo(() => {
    type Ev = { date: Date; label: string; kind: "deadline" | "interview" | "task" | "follow-up" };
    const e: Ev[] = [];
    apps.forEach((a) => {
      e.push({ date: new Date(a.closingDate), label: `${a.title} closes`, kind: "deadline" });
      if (a.followUpDate) e.push({ date: new Date(a.followUpDate), label: `Follow up: ${getCompany(a.companyId)?.name}`, kind: "follow-up" });
    });
    interviews.forEach((i) => e.push({ date: new Date(i.datetime), label: `${i.role} (${i.type})`, kind: "interview" }));
    tasks.forEach((t) => e.push({ date: new Date(t.dueDate), label: t.name, kind: "task" }));
    return e;
  }, [apps, interviews, tasks]);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  });

  const [selected, setSelected] = useState<Date | null>(new Date());
  const selectedEvents = selected ? events.filter((e) => isSameDay(e.date, selected)).sort((a, b) => a.date.getTime() - b.date.getTime()) : [];

  const colorByKind = {
    deadline: "bg-warning",
    interview: "bg-primary",
    task: "bg-chart-2",
    "follow-up": "bg-chart-4",
  } as const;

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-in">
      <PageHeader
        title="Calendar & Deadlines"
        description="Every key date in one premium view"
        actions={
          <TaskFormDialog trigger={
            <Button className="bg-gradient-emerald text-primary-foreground glow-ring-sm hover:opacity-95">
              <Plus className="h-4 w-4" /> Add task
            </Button>
          } />
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">{format(month, "MMMM yyyy")}</h2>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setMonth(addMonths(month, -1))}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" onClick={() => setMonth(new Date())}>Today</Button>
              <Button variant="ghost" size="icon" onClick={() => setMonth(addMonths(month, 1))}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dayEvents = events.filter((e) => isSameDay(e.date, day));
              const inMonth = isSameMonth(day, month);
              const isSel = selected && isSameDay(day, selected);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelected(day)}
                  className={cn(
                    "group relative aspect-square min-h-[64px] rounded-lg border p-1.5 text-left transition-all sm:min-h-[80px]",
                    inMonth ? "border-border bg-surface text-foreground" : "border-transparent text-muted-foreground/50",
                    isSel && "border-primary glow-ring-sm",
                    isSameDay(day, new Date()) && "border-primary/60",
                  )}
                >
                  <div className="text-xs font-semibold">{format(day, "d")}</div>
                  <div className="mt-1 flex flex-wrap gap-0.5">
                    {dayEvents.slice(0, 4).map((e, i) => (
                      <span key={i} className={cn("h-1.5 w-1.5 rounded-full", colorByKind[e.kind])} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            {Object.entries(colorByKind).map(([k, c]) => (
              <span key={k} className="flex items-center gap-1.5"><span className={cn("h-2 w-2 rounded-full", c)} />{k}</span>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display text-base font-semibold">{selected ? format(selected, "EEEE, MMM d") : "Select a date"}</h3>
          <p className="text-xs text-muted-foreground">{selectedEvents.length} event{selectedEvents.length !== 1 ? "s" : ""}</p>
          <ul className="mt-4 space-y-2">
            {selectedEvents.length === 0 && <li className="text-sm text-muted-foreground">Nothing scheduled.</li>}
            {selectedEvents.map((e, i) => (
              <li key={i} className="flex items-start gap-2 rounded-lg border border-border p-3">
                <span className={cn("mt-1.5 h-2 w-2 rounded-full", colorByKind[e.kind])} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{e.label}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{e.kind}</div>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
