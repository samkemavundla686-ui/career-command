import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Plus, Video, MapPin, Phone, ClipboardCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/section-card";
import { InterviewFormDialog } from "@/components/interview-form-dialog";
import { useStore, upcomingInterviews, pastInterviews, getCompany, type Interview } from "@/lib/store";

export const Route = createFileRoute("/interviews")({
  head: () => ({
    meta: [
      { title: "Interviews — Shemove Hub" },
      { name: "description", content: "Prepare, schedule and reflect on every interview." },
    ],
  }),
  component: InterviewsPage,
});

const iconForType = (t: string) => {
  switch (t) {
    case "Online": return Video;
    case "Phone": return Phone;
    case "Assessment": return ClipboardCheck;
    case "Panel": return Users;
    default: return MapPin;
  }
};

function readinessFor(i: Interview) {
  if (!i.prep.length) return 0;
  return Math.round((i.prep.filter((p) => p.done).length / i.prep.length) * 100);
}

function InterviewsPage() {
  const updateInterview = useStore((s) => s.updateInterview);
  const upcoming = upcomingInterviews();
  const past = pastInterviews();

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-in">
      <PageHeader
        title="Interviews & Meetings"
        description={`${upcoming.length} upcoming · ${past.length} past`}
        actions={
          <InterviewFormDialog trigger={
            <Button className="bg-gradient-emerald text-primary-foreground glow-ring-sm hover:opacity-95">
              <Plus className="h-4 w-4" /> Schedule
            </Button>
          } />
        }
      />

      <SectionCard title="Upcoming">
        {upcoming.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No interviews scheduled.</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {upcoming.map((i) => {
              const Icon = iconForType(i.type);
              const readiness = readinessFor(i);
              return (
                <article key={i.id} className="relative overflow-hidden rounded-2xl border border-border bg-surface-elevated p-5">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-glow opacity-70" />
                  <div className="relative flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                        <Icon className="h-3.5 w-3.5 text-primary" /> {i.type}
                      </div>
                      <h3 className="mt-1 font-display text-lg font-semibold">{i.role}</h3>
                      <p className="text-xs text-muted-foreground">{getCompany(i.companyId)?.name}{i.interviewer ? ` · ${i.interviewer}` : ""}</p>
                      <p className="mt-1 text-sm text-primary">{format(new Date(i.datetime), "EEE, MMM d 'at' p")}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl font-semibold text-primary">{readiness}%</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">readiness</div>
                    </div>
                  </div>

                  <div className="relative mt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prep checklist</h4>
                    {i.prep.length === 0 ? (
                      <p className="mt-2 text-xs text-muted-foreground">No prep tasks yet.</p>
                    ) : (
                      <ul className="mt-2 space-y-1.5">
                        {i.prep.map((p, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={p.done}
                              onChange={(e) => {
                                const next = [...i.prep];
                                next[idx] = { ...next[idx], done: e.target.checked };
                                updateInterview(i.id, { prep: next });
                              }}
                              className="h-4 w-4 accent-[oklch(0.68_0.17_156)]"
                            />
                            <span className={p.done ? "text-muted-foreground line-through" : ""}>{p.task}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {(i.questionsToAsk.length > 0 || i.expectedQuestions.length > 0) && (
                    <div className="relative mt-4 grid gap-3 sm:grid-cols-2">
                      {i.questionsToAsk.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ask them</h4>
                          <ul className="mt-1.5 space-y-1 text-xs text-foreground">
                            {i.questionsToAsk.map((q, idx) => <li key={idx}>• {q}</li>)}
                          </ul>
                        </div>
                      )}
                      {i.expectedQuestions.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Likely questions</h4>
                          <ul className="mt-1.5 space-y-1 text-xs text-foreground">
                            {i.expectedQuestions.map((q, idx) => <li key={idx}>• {q}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Past interviews" description="Reflect and follow up">
        {past.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No past interviews.</p>
        ) : (
          <ul className="divide-y divide-border">
            {past.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">{i.role}</div>
                  <div className="text-xs text-muted-foreground">{getCompany(i.companyId)?.name} · {i.type} · {format(new Date(i.datetime), "MMM d, yyyy")}</div>
                </div>
                {i.reflection && <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">Reflected</span>}
                {i.thankYouSent && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary">Thanked</span>}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
